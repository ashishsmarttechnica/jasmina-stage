"use client";

import ImageFallback from "@/common/shared/ImageFallback";
import { Link, useRouter } from "@/i18n/navigation";
import getImg from "@/lib/getImg";
import useAuthStore from "@/store/auth.store";
// import { getnotificationSocket } from "@/utils/socket";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiBriefcase, FiHome, FiLogOut, FiMessageSquare, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import flowerIcon from "../../assets/header/flower.png";
import useChatNotifications from "../../hooks/chat/useChatNotifications";
import MultiLanguageDropdown from "./MultiLanguageDropdown";

const UserNavItems = ({ onLinkClick }) => {
  const pathname = usePathname();
  const t = useTranslations("UserHeader");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isNotificationsActive = pathname === "/notifications";
  const isChatActive = pathname === "/chat";
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { user } = useAuthStore();
  const { updateCounts } = useNotificationContext();

  // Use the centralized chat notifications hook
  const { chatCount, notificationCount, socketConnected } = useChatNotifications(user?._id, user);

  // Update context with counts
  useEffect(() => {
    updateCounts({ chatCount, notificationCount });
  }, [chatCount, notificationCount]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <MultiLanguageDropdown />
      {/* <div className="space-y-8 mt-10"> */}
      <Link
        href="/"
        className="mx-1 hidden flex-row items-center space-x-2.5 border-b border-transparent pb-3 no-underline transition-all duration-300 ease-in-out hover:border-white md:flex md:flex-col md:pb-1 lg:flex-row"
        onClick={onLinkClick}
      >
        <FiHome className="h-5 w-5 text-white md:m-0 lg:mr-2" />
        <span className="text-sm md:text-xs">{t("home")}</span>
      </Link>

      <Link
        href="/jobs"
        className="mx-1 hidden flex-row items-center space-x-2.5 border-b border-transparent pb-3 no-underline transition-all duration-300 ease-in-out hover:border-white md:flex md:flex-col md:pb-1 lg:flex-row"
        onClick={onLinkClick}
      >
        <FiBriefcase className="h-5 w-5 text-white" />
        <span className="text-sm text-nowrap md:text-xs">{t("JobOpportunities")}</span>
      </Link>

      <Link
        href="/connections?tab=people"
        className="mx-1 hidden flex-row items-center space-x-1.5 border-b border-transparent pb-3 no-underline transition-all duration-300 ease-in-out hover:border-white md:flex md:flex-col md:pb-1 lg:flex-row"
        onClick={onLinkClick}
      >
        <FiUsers className="h-5 w-5 text-white" />
        <span className="text-sm md:text-xs">{t("Contacts")}</span>
      </Link>

      <Link
        href="/chat"
        className={`relative mx-1 hidden items-center space-x-1 pb-3 no-underline md:flex md:pb-0 ${isChatActive ? "rounded-full bg-white text-[#1D2F38]" : "text-white"
          }`}
        onClick={onLinkClick}
      >
        <div className={`rounded-full p-[5px] ${isChatActive ? "bg-white" : "bg-transparent"}`}>
          <FiMessageSquare
            className={`h-5 w-5 ${isChatActive ? "text-[#1D2F38]" : "text-white"}`}
          />
        </div>
        <span className="block text-sm text-white md:hidden md:text-xs">{t("Messages")}</span>
        {chatCount > 0 && (
          <span className="absolute end-1 bottom-5 flex h-3 w-3 items-center justify-center rounded-full bg-[#DE4437] p-2 text-[12px] font-bold text-white">
            {chatCount > 99 ? "99+" : chatCount}
          </span>
        )}
        {/* Debug: Show chat count */}
        {/* {console.log("[UserNavItems] Rendering with chatCount:", chatCount)} */}
      </Link>

      <Link
        href="/addnotifi"
        className={`relative hidden items-center space-x-1.5 pb-3 no-underline md:flex md:pb-0 ${isNotificationsActive ? "rounded-full bg-white text-[#1D2F38]" : "text-white"
          }`}
        onClick={onLinkClick}
      >
        <div
          className={`rounded-full p-[5px] ${isNotificationsActive ? "bg-white" : "bg-transparent"
            }`}
        >
          <Image
            src={flowerIcon}
            alt="Notifications"
            width={22}
            height={22}
            className="rounded-full"
          />
        </div>
        <span className="block text-white md:hidden">{t("Notification")}</span>

        {notificationCount > 0 && (
          <span className="absolute end-1 bottom-5 flex h-3 w-3 items-center justify-center rounded-full bg-[#0eb3c9] p-2 text-[12px] font-bold text-white">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        )}
        {/* Debug: Show notification count */}
        {/* {console.log("[UserNavItems] Rendering with notificationCount:", notificationCount)} */}
      </Link>
      <Link
        href={`/single-user/${user?._id}`}
        className="flex items-center space-x-1.5 pb-3 no-underline md:hidden"
        onClick={onLinkClick}
      >
        {user?.profile && (
          <ImageFallback
            src={user?.profile?.photo && getImg(user?.profile?.photo)}
            alt={"user"}
            width={30}
            height={30}
            className="h-[30px] w-[30px] cursor-pointer rounded-full transition-opacity hover:opacity-80"
            priority={true}
          />
        )}
        <span className="block text-sm text-white md:hidden md:text-xs">
          {user?.profile?.fullName}
        </span>
      </Link>
      <div className="block md:hidden">
        <button
          className="flex w-full items-center space-x-1.5 pb-3 text-left text-sm text-white md:text-xs"
          onClick={() => {
            logout();
            router.push("/login");
            toast.success("Logout successful!");
          }}
        >
          <FiLogOut className="h-5 w-5 text-white" />
          <span className="text-sm">{t("logout")}</span>
        </button>
      </div>
      <div className="relative hidden px-1 md:block" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex no-underline focus:outline-none"
        >
          {user?.profile && (
            <ImageFallback
              src={user?.profile?.photo && getImg(user?.profile?.photo)}
              alt={"user"}
              width={30}
              height={30}
              className="h-[30px] w-[30px] cursor-pointer rounded-full transition-opacity hover:opacity-80"
              priority={true}
            />
          )}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 z-50 mt-2 w-40 rounded-md bg-white shadow-lg">
            <Link
              href={`/single-user/${user?._id}`}
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(false);
                onLinkClick && onLinkClick();
              }}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              {t("viewProfile")}
            </Link>
            <button
              className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              onClick={() => {
                logout();
                router.push("/login");
                toast.success("Logout successful!");
              }}
            >
              {t("logout")}
            </button>
          </div>
        )}
      </div>
      {/* </div> */}
    </>
  );
};

export default UserNavItems;
