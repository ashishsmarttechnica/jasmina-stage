import ImageFallback from "@/common/shared/ImageFallback";
import { useGenerateChatRoom } from "@/hooks/chat/useGenerateChatRoom";
import { useRemoveConnection } from "@/hooks/connections/useConnections";
import { useRouter } from "@/i18n/navigation";
import getImg from "@/lib/getImg";
import useAuthStore from "@/store/auth.store";
import useConnectionsStore from "@/store/connections.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiMessageSquare, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import galleryIcon from "@/assets/gallery.png";

const PeopleCard = ({ person, profileId }) => {
  // console.log(person, "person||||");
  const currentUserId = Cookies.get("userId");
  const [isRemoving, setIsRemoving] = useState(false);
  const { mutate: removeConnection, isPending } = useRemoveConnection();
  const { mutate: generateChatRoom, isPending: isGeneratingChat } = useGenerateChatRoom();
  const { connections, setConnections } = useConnectionsStore();
  const searchParams = useSearchParams();
  const tabId = searchParams.get("profileId");

  const { user } = useAuthStore();
  const router = useRouter();
  const t = useTranslations("CompanyProfile.singleCompanyTab");
  const UserId = person?.details?._id;



  const isOwnUser = (UserId) === (currentUserId);

  const isViewingOtherProfile = profileId && profileId !== currentUserId;

  const shouldShowRemoveButton = currentUserId && !isOwnUser && (isViewingOtherProfile || !profileId);

  const availabilityIcons = {
    "Open to Work": "🟢",
    "Available for Freelance": "🟡",
    "Not Available": "🔴",
    " Open for Remote Worldwide": "🌍",
  };

  const handleProfile = (user) => {
    router.push(`/single-user/${user._id}?fromConnections=true`);
  };

  // console.log(person, "sdfffffffffffffffffffffffffffffffffff");

  const handleRemove = (user) => {
    setIsRemoving(true);

    removeConnection(
      { id: user.connectionId, role: user.connectionType },
      {
        onSuccess: (res) => {
          if (res.success) {
            // Only remove from store after successful API response
            const updatedConnections = connections.filter((conn) => conn._id !== person._id);
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

  const handleMessage = (user) => {
    // Get current user ID and the person's ID for the chat API
    const currentUserId = Cookies.get("userId");
    const profileId = user?._id;

    if (currentUserId && profileId) {
      generateChatRoom(
        { userId: currentUserId, profileId: profileId },
        {
          onSuccess: (res) => {
            if (res.success) {
              // Navigate to chat with the generated room
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
      className={`flex flex-row justify-between border-b border-black/10 bg-white px-2 py-4 transition-all duration-300 hover:bg-gray-50  sm:items-center connection-card ${isRemoving ? "translate-x-full transform opacity-0" : ""
        }`}
    >
      {/* Avatar and Info */}
      <div
        className="flex w-full min-w-0 cursor-pointer items-center gap-4 sm:w-auto"
        onClick={() => handleProfile(person?.details)}
      >
        <ImageFallback
          src={person?.details?.profile?.photo && getImg(person?.details?.profile?.photo)}
          width={48}
          height={48}
          alt={person?.details?.profile?.fullName}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <div
              className="text-custBlack cursor-pointer truncate font-semibold"
              onClick={() => handleProfile(person?.details)}
            >
              {person?.details?.profile?.fullName}
            </div>
            {person?.details?.isLGBTQFriendly && (
              <Image
                src={galleryIcon}
                alt="LGBTQ friendly"
                width={20}
                height={20}
                className="inline-block"
              />
            )}
            {person?.details?.profile?.availabilty && (
              <span className="text-primary mx-2 text-[9px]">
                {availabilityIcons[person?.details?.profile?.availabilty] || ""}
              </span>
            )}
          </div>
          <div className="text-grayBlueText truncate text-sm">
            {person?.details?.preferences?.jobRole}
          </div>
          <div className="text-grayBlueText mt-0.5 flex items-center gap-1 text-xs">
            <FaMapMarkerAlt className="text-primary" />
            <span className="truncate">{person?.details?.profile?.location}</span>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-col gap-[10px]">
        <div className="mt-3 flex w-full flex-col gap-3 sm:mt-0 sm:w-auto sm:min-w-[140px] sm:flex-row sm:items-center">
          <div className="flex w-full flex-row gap-2 sm:w-auto justify-center">
            {/* Message button - show for all users except own profile */}
            {!isOwnUser && (
              <button
                className="text-primary border-primary hover:bg-primary flex items-center justify-center gap-2 rounded sm:border px-4 py-1.5 text-sm font-medium transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                onClick={() => handleMessage(person?.details)}
                disabled={isGeneratingChat}
              >
                {/* Icon for mobile */}
                <FiMessageSquare className="block sm:hidden text-lg" />
                {/* Text for desktop */}
                <span className="hidden sm:block">
                  {isGeneratingChat ? "Generating..." : t("message")}
                </span>
              </button>
            )}

            {/* Remove button - only show when conditions are met */}
            {!shouldShowRemoveButton && (
              <button
                onClick={() => handleRemove(person)}
                disabled={isPending}
                className="text-grayBlueText border-grayBlueText/40 flex items-center justify-center gap-2 rounded sm:border px-4 py-1.5 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {/* Icon for mobile */}
                <FiTrash2 className="block sm:hidden text-lg" />
                {/* Text for desktop */}
                <span className="hidden sm:block">
                  {isPending ? `${t("removing")}` : `${t("remove")}`}
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="text-grayBlueText text-center text-xs sm:text-right">
          {person.details?.updatedAt &&
            `${t("connecton")} ${new Date(person.details.updatedAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}`}
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
