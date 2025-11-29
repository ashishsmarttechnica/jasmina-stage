"use client";
import noImage2 from "@/assets/feed/no-img.png";
import { usePathname, useRouter } from "@/i18n/navigation";
import useAuthStore from "@/store/auth.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { BiLogOut } from "react-icons/bi";
import { BsCreditCard, BsFileEarmarkText } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { MdHistory, MdSettings } from "react-icons/md";
import { RiHandCoinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useSingleCompany } from "../hooks/company/useSingleCompany";
import getImg from "../lib/getImg";
import Card from "./card/Card";
import ImageFallback from "./shared/ImageFallback";

const MainCompanyProfile = ({ title }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const t = useTranslations("CompanyProfile");

  // Get user ID from cookies instead of auth store
  const userId = Cookies.get("userId");

  // Fetch company data from API
  const { data: companyData, isLoading, error } = useSingleCompany(userId);

  console.log(companyData, "companyData from API");
  // Build a cache-busted logo URL so the image updates immediately after edits
  const logoSrc = companyData?.logoUrl
    ? `${getImg(companyData.logoUrl)}?v=${companyData?.updatedAt || Date.now()}`
    : user?.logoUrl
      ? getImg(user.logoUrl)
      : "";
  const handleMenuClick = (item) => {
    if (item.isLogout) {
      logout();
      router.push("/login");
      toast.success(t("LogoutSuccess"));
    } else if (pathname !== item.path) {
      router.push(item.path);
    }
  };

  const menuItems = [
    {
      icon: (isActive) => (
        <FiUser className={`text-xl ${isActive ? "text-black" : "text-gray-500"}`} />
      ),
      label: t("Profile"),
      path: `/company/single-company/${userId}`,
      count: null,
    },
    // {
    //   icon: (isActive) => (
    //     <MdWork className={`text-xl ${isActive ? "text-black" : "text-gray-500"}`} />
    //   ),
    //   label: t('PostaJob'),
    //   path: `/company/single-company/${userId}/postjob`,
    //   // count: 3,
    // },
    {
      icon: (isActive) => (
        <BsFileEarmarkText className={`text-xl ${isActive ? "text-black" : "text-gray-500"}`} />
      ),
      label: t("ReviewApplications"),
      path: `/company/single-company/${userId}/applications`,
      // count: 45,
    },
    {
      icon: (isActive) => (
        <RiHandCoinLine className={`text-xl ${isActive ? "text-black" : "text-gray-500"}`} />
      ),
      label: t("Interview"),
      path: `/company/single-company/${userId}/interview`,
      count: null,
    },
    {
      icon: (isActive) => (
        <MdSettings className={`text-xl ${isActive ? "text-black" : "text-gray-500"}`} />
      ),
      label: t("Settings"),
      path: `/company/single-company/${userId}/settings`,
      // count: null,
    },
   ...(user?.companyType !== "ngo"
  ? [
      {
        icon: (isActive) => (
          <BsCreditCard
            className={`text-xl ${isActive ? "text-black" : "text-gray-500"}`}
          />
        ),
        label: t("Subscription"),
        path: `/company/single-company/${userId}/subscription`,
        count: null,
      },
    ]
  : []),



   ...(user?.companyType !== "ngo" ? [
    {
      icon: (isActive) => (
        <MdHistory className={`text-xl ${isActive ? "text-black" : "text-gray-500"}`} />
      ),
      label: t("PreviousPlans"),
      path: `/company/single-company/${userId}/previousplans`,
      // count: null,
    },
  ]:[]),
    
    {
      icon: (isActive) => (
        <BiLogOut className={`text-xl ${isActive ? "text-black" : "text-gray-500"}`} />
      ),
      label: t("Logout"),
      isLogout: true,
      path: "/logout",
      count: null,
    },
  ];

  return (
    <Card className="md:w-full md:max-w-full xl:max-w-[266px]">
      <div className="flex w-full flex-col">
        {/* Company Logo and Name */}
        <div className="border-b border-slate-100 px-5 py-3">
          <div className="flex items-center gap-3">
            <ImageFallback
              key={logoSrc}
              src={logoSrc}
              loading="lazy"
              width={128}
              height={128}
              fallbackSrc={noImage2}
              alt={companyData?.companyName ?? "Company"}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-lg font-semibold">{companyData?.companyName || user?.companyName}</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex w-full flex-col">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={index}
                className="flex w-full items-center justify-between border-t border-slate-100 px-6 py-3 transition-colors hover:bg-gray-100"
                onClick={() => handleMenuClick(item)}
              >
                <div className="flex items-center gap-3">
                  {typeof item.icon === "function" ? item.icon(isActive) : item.icon}
                  <span className={`text-[13px] ${isActive ? "text-black" : "text-gray-600"}`}>
                    {item.label}
                  </span>
                </div>
                {item.count !== null && (
                  <span
                    className={`text-[12px] font-bold ${isActive ? "text-black" : "text-gray-700"}`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default MainCompanyProfile;
