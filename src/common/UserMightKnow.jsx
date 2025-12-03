"use client";
import galleryIcon from "@/assets/gallery.png";
import Contact from "@/assets/svg/feed/Contact";
import Card from "@/common/card/Card";
import CardHeading from "@/common/card/CardHeading";
import { useCreateConnection } from "@/hooks/connections/useConnections";
import { useCompanySuggestions, useUserSuggestions } from "@/hooks/user/useUserSuggestions";
import { useRouter } from "@/i18n/navigation";
import capitalize from "@/lib/capitalize";
import getImg from "@/lib/getImg";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FaBuilding, FaUser } from "react-icons/fa";
import { NameWithTooltip, SubtitleWithTooltip } from "../utils/tooltipUtils";
import ImageFallback from "./shared/ImageFallback";
import UserMightKnowSkeleton from "./skeleton/UserMightKnowSkeleton";
const UserMightKnow = ({ title }) => {
  const userType = capitalize(Cookies.get("userRole"));
  // console.log(userType, "userType+++++++++++++++++");
  const availabilityIcons = {
    "Open to Work": "🟢",
    "Available for Freelance": "🟡",
    "Not Available": "🔴",
    " Open for Remote Worldwide": "🌍",
  };
  // Conditionally use the correct store and hook
  let suggestions, setSuggestions, resetStore, data, isLoading, isError, error, refetch;
  if (userType === "Company") {
    // Only call company suggestions and store
    const companyStore = require("@/store/userMightKnow.store");
    ({ suggestions, setSuggestions, resetStore } = companyStore.useCompanySuggestionsStore());
    ({ data, isLoading, isError, error, refetch } = useCompanySuggestions());
  } else {
    // Only call user suggestions and store
    const userStore = require("@/store/userMightKnow.store");
    ({ suggestions, setSuggestions, resetStore } = userStore.default());
    ({ data, isLoading, isError, error, refetch } = useUserSuggestions());
  }

  const {
    mutate: createConnection,
    isPending,
    isLoading: isCreateConnectionLoading,
  } = useCreateConnection();
  const t = useTranslations("UserMainFeed");

  const displayData = suggestions?.results || data?.results;
  const router = useRouter();

  const getItemConfig = (item) => {
    const configs = {
      User: {
        image: item.profile?.photo,
        name: item.profile?.fullName,
        subtitle: item?.profile?.preferences?.jobRole,
        showOnline: true,
        availabilty: item.profile?.availabilty,
        online: item.online,
        type: "User",
        typeColor: "text-blue-600",
        icon: <FaUser className="h-3 w-3" />,

      },
      Company: {
        image: item.logoUrl,
        name: item.companyName,
        subtitle: item.industryType,
        isLGBTQFriendly: item.isLGBTQFriendly,
        showOnline: false,
        availabilty: item.profile?.availabilty,
        online: false,
        type: "Company",
        typeColor: "text-green-600",
        icon: <FaBuilding className="h-3 w-3" />,
      },
    };

    return configs[item.type] || configs.User;
  };

  const handleContactClick = (item) => {
    console.log(item, "item34543534534");

    if (isCreateConnectionLoading) return;
    createConnection(
      { id: item._id, role: item.type },
      {
        onSuccess: (res) => {
          if (res.success) {
            resetStore();
            refetch();
          }
        },
      }
    );
  };

  const handleUserProfile = (user) => {
    if (capitalize(user.role) === "User") {
      router.push(`/single-user/${user._id}`);
    } else {
      router.push(`/company/single-company/${user._id}?fromNetworkInvites=true`);
    }
  };

  if (isLoading || !displayData) {
    return <UserMightKnowSkeleton />;
  }

  if (isError) {
    return (
      <Card className="sm:w-full md:w-full md:max-w-full xl:max-w-[266px]">
        <CardHeading title={t("Youmayknow")} />
        <div className="w-full px-2 py-4">
          <p className="text-center text-red-500">
            {error?.message || "Failed to load suggestions"}
          </p>
        </div>
      </Card>
    );
  }

  if (!displayData.length) {
    return (
      <Card className="sm:w-full md:w-full md:max-w-full xl:max-w-[266px]">
        <CardHeading title={t("Youmayknow")} />
        <div className="w-full px-2 py-4">
          <p className="text-center text-gray-500">No suggestions available at the moment</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="sm:w-full md:w-full md:max-w-full xl:max-w-[266px]">
      <CardHeading title={t("Youmayknow")} />
      <div
        className={`flex w-full flex-col gap-2 px-2 py-4 ${
          displayData.length > 5 ? "max-h-80 overflow-y-auto" : ""
          }`}
      >
        {displayData?.map((item) => {
          const config = getItemConfig(item);
          // console.log(config, "configconfig");

          // console.log(config.image, "hello jkjkjksdjkfksdk00000");
          // console.log(item?.profile?.fullName
          // , "item");

          return (
            <div key={item._id} className="flex w-full items-center justify-between p-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="relative h-10 w-10 cursor-pointer"
                  onClick={() => handleUserProfile(item)}
                >
                  <ImageFallback
                    src={config.image && getImg(config.image)}
                    alt={config.name ?? "item"}
                    width={32}
                    height={32}
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {config.showOnline && config.online && (
                    <span className="bg-primary absolute right-0 bottom-0 h-2 w-2 rounded-full border border-white" />
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1">
                    <NameWithTooltip
                      name={config.name}
                      id={item._id}
                      onClick={() => handleUserProfile(item)}
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
                        width={19}
                        height={19}
                        className="inline-block"
                      />
                    )}
                  </div>
                  <SubtitleWithTooltip subtitle={config.subtitle} id={item._id} />
                </div>
              </div>

              <button
                onClick={() => handleContactClick(item)}
                disabled={isCreateConnectionLoading}
                className={`rounded-sm border p-1.5 transition-colors duration-300 ${
                  isCreateConnectionLoading
                    ? "cursor-not-allowed bg-gray-300 opacity-50"
                    : "bg-secondary hover:border-primary border-transparent hover:bg-transparent"
                  }`}
              >
                <Contact className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default UserMightKnow;
