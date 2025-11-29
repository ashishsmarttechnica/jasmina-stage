"use client";
import ImageFallback from "@/common/shared/ImageFallback";
import {
  useAcceptConnection,
  useNetworkInvites,
  useRejectConnection,
} from "@/hooks/user/useNetworkInvites";
import { useRouter } from "@/i18n/navigation";
import capitalize from "@/lib/capitalize";
import getImg from "@/lib/getImg";
import useNetworkInvitesStore from "@/store/networkInvites.store";
import { NameWithTooltip, SubtitleWithTooltip } from "@/utils/tooltipUtils";
import { useTranslations } from "next-intl";
import { FaBuilding, FaUser } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Card from "./card/Card";
import CardHeading from "./card/CardHeading";
import UserMightKnowSkeleton from "./skeleton/UserMightKnowSkeleton";
import Image from "next/image";
import galleryIcon from "@/assets/gallery.png";
// Helper function
const isNameLong = (name, maxLength = 15) => name && name.length > maxLength;

const UserNetworkInvites = ({ title }) => {
  const t = useTranslations("UserMainFeed");
  const { data: networkInvitesData } = useNetworkInvitesStore();
  const { data, isLoading, isError, error, refetch } = useNetworkInvites();
  const { mutate: acceptConnection, isPending } = useAcceptConnection();
  const { mutate: rejectConnection, isPending: rejectPending } = useRejectConnection();
  const displayData = networkInvitesData || data;
  const router = useRouter();
  const getItemConfig = (item) => {
    const type = item?.senderType;
    if (!type || (type !== "User" && type !== "Company")) {
      console.warn("Unknown sender type:", type, item);
    }

    const configs = {
      User: {
        image: item?.senderDetails?.profile?.photo,
        name: item?.senderDetails?.profile?.fullName,
        subtitle: item?.senderDetails?.preferences?.jobRole,
        showOnline: true,
        online: item?.senderDetails?.online,
        type: "User",
        typeColor: "text-blue-600",
        icon: <FaUser className="h-3 w-3" />,
      },
      Company: {
        image: item?.senderDetails?.logoUrl,
        name: item?.senderDetails?.companyName,
        subtitle: item?.senderDetails?.industryType,
        isLGBTQFriendly: item?.senderDetails?.isLGBTQFriendly,
        showOnline: false,
        online: false,
        type: "Company",
        typeColor: "text-green-600",
        icon: <FaBuilding className="h-3 w-3" />,
      },
    };

    return configs[type] || configs.User;
  };

  const handleInviteAction = (user, action) => {
    const { _id, role } = user?.senderDetails || {};
    if (!_id || !role) {
      console.warn("Invalid senderDetails", user);
      return;
    }

    const actionFn = action === "accept" ? acceptConnection : rejectConnection;

    actionFn(
      { id: _id, role },
      {
        onSuccess: (res) => {
          if (res.success) refetch();
        },
      }
    );
  };

  const handleUserProfile = (user) => {
    if (capitalize(user?.senderType) === "User") {
      router.push(`/single-user/${user?.senderDetails?._id}`);
    } else {
      router.push(`/company/single-company/${user?.senderDetails?._id}?fromNetworkInvites=true`);
    }
  };

  if (isLoading || !displayData) {
    return <UserMightKnowSkeleton isreq={true} />;
  }

  if (isError) {
    return (
      <Card className="md:w-full md:max-w-full xl:max-w-[266px] sm:w-full">
        <CardHeading title={title} />
        <div className="w-full px-2 py-4">
          <p className="text-center text-red-500">
            {/* {error?.message || "Failed to load suggestions"} */}
          </p>
        </div>
      </Card>
    );
  }

  if (!displayData.length) {
    return (
      <Card className="md:w-full md:max-w-full xl:max-w-[266px] sm:w-full">
        <CardHeading title={title} />
        <div className="w-full px-2 py-4">
          <p className="text-center text-gray-500">{t("noNetworkInvites")}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:w-full md:max-w-full xl:max-w-[266px] sm:w-full">
      <CardHeading title={title} />
      <div
        className={`flex w-full flex-col gap-4 px-2 py-4 ${displayData.length > 5 ? "max-h-80 overflow-y-auto" : ""
          }`}
      >
        {displayData.map((item) => {
          const config = getItemConfig(item);

          return (
            <div key={item?._id} className="flex w-full items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="relative h-10 w-10 cursor-pointer"
                  onClick={() => handleUserProfile(item)}
                >
                  <ImageFallback
                    src={config.image && getImg(config.image)}
                    alt={config.name ?? "user"}
                    width={32}
                    height={32}
                    className="h-full w-full rounded-full object-cover"
                  />
                  {config.showOnline && config.online && (
                    <span className="bg-primary absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white" />
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <NameWithTooltip
                      name={config.name}
                      id={item?._id}
                      onClick={() => handleUserProfile(item)}
                    />
                    <span className={config.typeColor}>{config.icon}</span>
                      {config.isLGBTQFriendly && (
                                        <Image
                                          src={galleryIcon}
                                          alt="LGBTQ friendly"
                                          width={22}
                                          height={22}
                                          className="inline-block"
                                        />
                                      )}
                  </div>
                  <SubtitleWithTooltip subtitle={config?.subtitle} id={item?._id} />
                </div>
              </div>

              <div className="flex gap-2 p-2">
                <button
                  onClick={() => handleInviteAction(item, "reject")}
                  className="border-grayBlueText text-grayBlueText cursor-pointer items-center rounded-sm border-[0.5px] px-1.5 py-1.5 transition-all duration-300 hover:scale-105 hover:border-red-600 hover:bg-red-600 hover:text-white"
                >
                  <IoClose className="h-[15px] w-[15px] font-medium" />
                </button>
                <button
                  onClick={() => handleInviteAction(item, "accept")}
                  className="border-primary bg-primary hover:border-grayBlueText cursor-pointer items-center rounded-sm border-[0.5px] px-1.5 py-1.5 text-white hover:bg-transparent hover:text-black"
                >
                  <FaCheck className="h-[15px] w-[15px] font-medium" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default UserNetworkInvites;
