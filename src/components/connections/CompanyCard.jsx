import galleryIcon from "@/assets/gallery.png";
import ImageFallback from "@/common/shared/ImageFallback";
import { useGenerateChatRoom } from "@/hooks/chat/useGenerateChatRoom";
import { useRemoveConnection } from "@/hooks/connections/useConnections";
import { useRouter } from "@/i18n/navigation";
import getImg from "@/lib/getImg";
import useConnectionsStore from "@/store/connections.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiMessageSquare, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
const CompanyCard = ({ company, userData, profileId }) => {
  // Current logged in user id from cookies
  const currentUserId = Cookies.get("userId");
  const CompanyId = company?.details?._id;

  // Debug logging
  // console.log({
  //   profileId,
  //   currentUserId,
  //   CompanyId,
  //   isOwnCompany: CompanyId === currentUserId,
  //   isViewingOtherProfile: profileId && profileId !== currentUserId
  // });


  const isOwnCompany = Boolean(currentUserId) && Boolean(CompanyId) && String(CompanyId) === String(currentUserId);

  const isViewingOtherProfile = profileId && profileId !== currentUserId;

  const shouldShowRemoveButton = currentUserId && !isOwnCompany && (isViewingOtherProfile || !profileId);

  const [isRemoving, setIsRemoving] = useState(false);
  const availabilityIcons = {
    "Open to Work": "🟢",
    "Available for Freelance": "🟡",
    "Not Available": "🔴",
    " Open for Remote Worldwide": "🌍",
  };
  const { mutate: removeConnection, isPending } = useRemoveConnection();
  const { mutate: generateChatRoom, isPending: isGeneratingChat } = useGenerateChatRoom();
  const { connections, setConnections } = useConnectionsStore();
  const router = useRouter();
  const t = useTranslations("UserProfile.profile.singleprofileTab");

  const handleProfile = (company) => {
    router.push(
      `/company/single-company/${company._id}?fromConnections=true&fromNetworkInvites=true`
    );
  };

  const handleRemove = (company) => {
    setIsRemoving(true);

    removeConnection(
      { id: company.connectionId, role: company.connectionType },
      {
        onSuccess: (res) => {
          if (res.success) {
            // Only remove from store after successful API response
            const updatedConnections = connections.filter((conn) => conn._id !== company._id);
            setConnections(updatedConnections);
          } else {
            toast.error(t("Failedtoremoveconnection"));
          }
        },
        onError: (error) => {
          toast.error(error?.message || t("Failedtoremoveconnection"));
        },
        onSettled: () => {
          setIsRemoving(false);
        },
      }
    );
  };

  const handleMessage = (company) => {
    const currentUserId = Cookies.get("userId");
    const profileId = company?.details?._id;

    if (currentUserId && profileId) {
      generateChatRoom(
        { userId: currentUserId, profileId },
        {
          onSuccess: (res) => {
            if (res.success) {
              router.push(`/chat?roomId=${res.data?.roomId || ""}`);
            } else {
              toast.error("Failed to generate chat room");
            }
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to generate chat room");
          },
        }
      );
    } else {
      toast.error("Unable to start chat. User information not available.");
    }
  };

  return (
    <div
      className={`flex flex-row justify-between border-b border-black/10 bg-white px-2 py-4 transition-all duration-300 hover:bg-gray-50 sm:items-center connection-card ${isRemoving ? "translate-x-full transform opacity-0" : ""
        }`}
    >
      {/* Logo and Info */}
      <div
        className="flex w-full min-w-0 cursor-pointer items-center gap-4 sm:w-auto"
        onClick={() => handleProfile(company.details)}
      >
        <ImageFallback
          src={company?.details?.logoUrl && getImg(company?.details?.logoUrl)}
          width={48}
          height={48}
          alt={company?.details?.companyName || "Company"}
          className="h-12 w-12 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex gap-2">
            <div
              className="text-custBlack cursor-pointer truncate font-semibold"
              onClick={() => handleProfile(company?.details)}
            >
              {company?.details?.companyName}
            </div>

            {company?.details?.isLGBTQFriendly && (
              <Image
                src={galleryIcon}
                alt="LGBTQ friendly"
                width={20}
                height={20}
                className="inline-block"
              />
            )}
          </div>
          <div className="text-grayBlueText truncate text-sm">{company?.details?.industryType}</div>

          <div className="text-grayBlueText mt-0.5 flex items-center gap-1 text-xs">
            <FaMapMarkerAlt className="text-primary" />
            <span className="truncate">
              {" "}
              {company?.details?.city} {company?.details?.country}
            </span>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-col gap-[10px]">
        <div className="mt-3 flex w-full flex-col gap-3 sm:mt-0 sm:w-auto sm:min-w-[140px] sm:flex-row sm:items-center">
          <div className="flex w-full flex-row gap-2 sm:w-auto justify-center">
            {/* Message button - show for all companies except own company */}
            {!isOwnCompany && (
              <button
                onClick={() => handleMessage(company)}
                disabled={isGeneratingChat}
                className="text-primary border-primary hover:bg-primary flex items-center justify-center gap-2  rounded sm:border px-4 py-1.5 text-sm font-medium transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <FiMessageSquare className="block sm:hidden text-lg" />
                <span className="hidden sm:block">
                  {isGeneratingChat ? "Generating..." : t("message")}
                </span>
              </button>
            )}

            {/* Remove button - only show when conditions are met */}
            {!shouldShowRemoveButton && (
              <button
                onClick={() => handleRemove(company)}
                disabled={isPending}
                className="text-grayBlueText border-grayBlueText/40 flex item-center justify-center gap-2 rounded sm:border px-4 py-1.5 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <FiTrash2 className="block sm:hidden text-lg" />
                <span className="hidden sm:block">
                  {isPending ? `${t("removing")}` : `${t("remove")}`}
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="text-grayBlueText text-center text-xs sm:text-right">
          {company?.details?.createdAt &&
            `${t("connecton")} ${new Date(company?.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}`}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
