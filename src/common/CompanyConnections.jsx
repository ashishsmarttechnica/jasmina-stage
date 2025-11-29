"use client";
import { useCompanyConnections } from "@/hooks/connections/useConnections";
import Image from "next/image";
import galleryIcon from "@/assets/gallery.png";
import { useRouter } from "@/i18n/navigation";
import getImg from "@/lib/getImg";
import { useCompanyConnectionsStore } from "@/store/connections.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { FaBuilding, FaUser } from "react-icons/fa6";
import { NameWithTooltip, SubtitleWithTooltip } from "../utils/tooltipUtils";
import Card from "./card/Card";
import CardHeading from "./card/CardHeading";
import ImageFallback from "./shared/ImageFallback";
import UserMightKnowSkeleton from "./skeleton/UserMightKnowSkeleton";
const CompanyConnections = ({ title }) => {
  const { connections } = useCompanyConnectionsStore();
  const userType = Cookies.get("userRole");
  const router = useRouter();
  const t = useTranslations("Common");
  const { data, isLoading, isError, error } = useCompanyConnections("Company", 1, 6);
  const displayData = connections?.length ? connections : data?.connections;
  const availabilityIcons = {
    "Open to Work": "🟢",
    "Available for Freelance": "🟡",
    "Not Available": "🔴",
    " Open for Remote Worldwide": "🌍",
  };
  const getItemConfig = (item) => {
    const type = item?.connectionType;
    if (!type || (type !== "User" && type !== "Company")) {
      console.warn("Unknown sender type:", type, item);
    }
    const configs = {
      User: {
        image: item?.details?.profile?.photo,
        name: item?.details?.profile?.fullName,
        subtitle: item?.details?.preferences?.jobRole,
        showOnline: true,
        online: item?.online,
        availabilty: item?.details?.profile?.availabilty,
        type: "User",
        typeColor: "text-blue-600",
        icon: <FaUser className="h-3 w-3" />,
      },
      Company: {
        image: item.details && item.details.logoUrl ? item.details.logoUrl : undefined,
        name: item.details?.companyName,
        subtitle: item.details?.industryType,
        isLGBTQFriendly: item.details?.isLGBTQFriendly,
        showOnline: false,
        online: false,
        availabilty: item?.details?.profile?.availabilty,
        type: "Company",
        typeColor: "text-green-600",
        icon: <FaBuilding className="h-3 w-3" />,
      },
    };

    return configs[type] || configs.User;
  };

  const handleUserProfile = (user) => {
    if (user.connectionType === "User") {
      router.push(`/single-user/${user.details._id}?fromConnections=true`);
    } else {
      router.push(`/company/single-company/${user.details._id}?fromConnections=true`);
    }
  };

  if (isLoading || !displayData) {
    return <UserMightKnowSkeleton isconnection={true} />;
  }

  if (isError) {
    return (
      <Card className="md:w-full md:max-w-full xl:max-w-[266px]">
        <CardHeading title={title} />
        <div className="w-full px-2 py-4">
          <p className="text-center text-red-500">
            {error?.message || "Failed to load connections"}
          </p>
        </div>
      </Card>
    );
  }

  if (!displayData.length) {
    return (
      <Card className="md:w-full md:max-w-full xl:max-w-[266px]">
        <CardHeading title={title} />
        <div className="w-full px-2 py-4">
          <p className="text-center text-gray-500">No connections available at the moment</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:w-full md:max-w-full xl:max-w-[266px]">
      <CardHeading title={title} />
      <div className={`flex w-full flex-col gap-4 px-5 py-4`}>
        {displayData.slice(0, 5).map((user) => {
          const config = getItemConfig(user);
          return (
            <div key={user._id} className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="relative h-10 w-10 cursor-pointer"
                  onClick={() => handleUserProfile(user)}
                >
                  <ImageFallback
                    src={config.image ? getImg(config.image) : undefined}
                    alt={config.name ?? "user"}
                    width={32}
                    height={32}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <NameWithTooltip
                      name={config.name}
                      id={user._id}
                      onClick={() => handleUserProfile(user)}
                    />
                    <span className={config.typeColor}>{config.icon}</span>
                    {config.availabilty && (
                      <span className="text-primary text-[9px]">
                        {availabilityIcons[config?.availabilty] || ""}
                      </span>
                    )}
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
                  <SubtitleWithTooltip subtitle={config.subtitle} id={user._id} />
                </div>
              </div>
            </div>
          );
        })}

        {/* More button */}
        {displayData.length > 5 && (
          <div className="flex justify-center border-t border-gray-200 pt-2">
            <button
              onClick={() => {
                const currentUserId = Cookies.get("userId");
                if (userType === "company") {
                  router.push(`/connections?profileId=${currentUserId}&type=Company&tab=company`);
                } else {
                  router.push("/connections?tab=company");
                }
              }}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              {t("viewMore")}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompanyConnections;
