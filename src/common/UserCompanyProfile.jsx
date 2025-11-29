"use client";
import noImage2 from "@/assets/feed/no-img.png";
import { useRouter } from "@/i18n/navigation";
import getImg from "@/lib/getImg";
import useAuthStore from "@/store/auth.store";
import { useTranslations } from "next-intl";
import Card from "./card/Card";
import ImageFallback from "./shared/ImageFallback";
import FeedProfileLeftSkeleton from "./skeleton/FeedProfileLeftSkeleton";

function UserCompanyProfile() {
  const { user, isAuthLoading } = useAuthStore();
  // console.log(user, "usersdfsd+++++++++++");
  const t = useTranslations("FeedProfileLeft");
  const router = useRouter();
  if (isAuthLoading && !user) {
    return <FeedProfileLeftSkeleton />;
  }
  return (
    <div>
      <Card className="md:w-full md:max-w-full xl:max-w-[266px]">
        <div className="flex flex-col items-center justify-center p-6">
          {/* <ImageFallback
            src={getImg(user?.coverBannerUrl) || profileImg}
            width={150}
            height={130}
            alt={user?.firstName ?? "Company"}
            className="mb-[25px] rounded-md w-[150px] h-[130px]"
          /> */}
          <ImageFallback
            src={user?.logoUrl ? getImg(user?.logoUrl) : null}
            fallbackSrc={noImage2}
            width={130}
            height={130}
            alt={user?.firstName ?? "Company"}
            className="mb-[25px] h-[130px] w-[130px] rounded-full"
            key={user?.logoUrl} // Force re-render when logoUrl changes
          />
          <h2 className="mb-2 text-center text-xl leading-[1.3] font-bold tracking-[0px]">
            {/* {user?.firstName
              ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
              : ""}{" "} */}
            {/* {user?.lastName ? user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1) : ""} */}
            {user?.companyName?.charAt(0).toUpperCase() + user?.companyName?.slice(1)}
          </h2>
          <p className="mb-0 text-center text-[13px]">
            {/* {user?.companyType} {user?.companyName} */}
            {user?.country} {user?.city}
          </p>
        </div>
        <div className="flex w-full justify-around border-y border-black/10">
          <div className="w-1/2 border-r border-black/10 py-2.5 text-center">
            <p className="text-[16px] font-bold">{user?.connectionCount}</p>
            <p className="text-sm">{t("connections")}</p>
          </div>
          <div className="w-1/2 py-2.5 text-center">
            <p className="text-[16px] font-bold">{user?.views}</p>
            <p className="text-sm">{t("views")}</p>
          </div>
        </div>
        <button
          className="cursor-pointer rounded-full px-5 py-4 text-[13px] font-medium text-black"
          onClick={() => {
            router.push(`/company/single-company/${user?._id}`);
          }}
        >
          {t("viewProfile")}
        </button>
      </Card>
    </div>
  );
}

export default UserCompanyProfile;
