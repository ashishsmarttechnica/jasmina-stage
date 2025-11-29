"use client";

import { useNotificationContext } from "@/contexts/NotificationContext";
import { Link } from "@/i18n/navigation";
import useAuthStore from "@/store/auth.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiBriefcase, FiHome, FiMessageSquare, FiUsers } from "react-icons/fi";
import flowerIcon from "../../assets/header/flower.png";
import CreateJobButton from "../../common/button/CreateJobButton";
import capitalize from "../../lib/capitalize";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const t = useTranslations("UserHeader");
    const userType = capitalize(Cookies.get("userRole"));
    const { user } = useAuthStore();
    const isNotificationsActive = pathname === "/addnotifi";
    const isChatActive = pathname === "/chat";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Get counts from context
    const { counts } = useNotificationContext();
    const { chatCount, notificationCount } = counts;

    // console.log("[MobileBottomNav] Current chatCount:", chatCount);
    // console.log("[MobileBottomNav] Current notificationCount:", notificationCount);

    // Dropdown outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // Hide navigation on auth pages and home pages
    const shouldHide = () => {
        if (!pathname) return false;

        // Hide on auth routes (login, signup, etc.)
        if (
            !user ||
            pathname.includes("/forgot-password") ||
            pathname.includes("/user/create-profile") ||
            pathname.includes("/company/create-profile") ||
            pathname.includes("/company/who-can-see-profile") ||
            pathname.includes("/verify-otp")
        ) {
            return true;
        }
        // if (pathname.includes('/login') ||
        //     pathname.includes('/signup') ||
        //     pathname.includes('/forgot-password') ||
        //     pathname.includes('/user/create-profile') ||
        //     pathname.includes('/company/create-profile') ||
        //     pathname.includes('/company/who-can-see-profile') ||
        //     pathname.includes('/verify-otp') ||
        //     pathname === "/" ||
        //     /^\/[a-z]{2}\/?$/.test(pathname)) {
        //     return true;
        // }

        return false;
    };
    const isActive = (route) => {
        try {
            if (!pathname) return false;
            // Works with locale-prefixed paths like /en/jobs
            return pathname === route || pathname.endsWith(route);
        } catch {
            return false;
        }
    };

    const baseItemClass =
        "flex flex-col items-center justify-center gap-0.5 text-[11px] no-underline";

    const iconClass = (active) => `h-5 w-5 ${active ? "text-white" : "text-[#D2D5D7]"}`;
    const flowericonClass = (active) => ` ${active ? "text-white" : "text-[#D2D5D7]"}`;
    const textClass = (active) =>
        `leading-tight text-center max-w-[70px] break-words h-[20px] ${active ? "text-white" : "text-[#D2D5D7]"}`;

    // Don't render if should hide
    if (shouldHide()) {
        return null;
    }

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#1D2F38] md:hidden"
        >
            <div className="container mx-auto">
                <ul className="flex items-center justify-between py-2">
                    <li>
                        <Link href="/" className={baseItemClass}>
                            <FiHome className={iconClass(isActive("/"))} />
                            <span className={textClass(isActive("/"))}>{t("home")}</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            href={
                                userType === "Company" && user?._id
                                    ? `/connections?profileId=${user?._id}&type=Company&tab=company`
                                    : "/connections"
                            }
                            className={baseItemClass}
                        >
                            <FiUsers className={iconClass(isActive("/connections"))} />
                            <span className={textClass(isActive("/connections"))}>{t("Network")}</span>
                        </Link>
                    </li>

                    {userType !== "Company" ? (
                        <li>
                            <Link href="/jobs" className={`${baseItemClass}`}>
                                <FiBriefcase className={iconClass(isActive("/jobs"))} />
                                <span className={textClass(isActive("/jobs"))}>{t("jobs")}</span>
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <CreateJobButton
                                isMobile={true}
                                baseItemClass={baseItemClass}
                                iconClass={iconClass}
                                textClass={textClass}
                                isActive={isActive}
                            />
                        </li>
                    )}
                    <li>
                        <Link
                            href="/chat"
                            className={`relative ${baseItemClass} ${isChatActive ? "rounded-full bg-white text-[#1D2F38]" : "text-white"}`}
                        >
                            <div
                                className={`rounded-full p-[5px] ${isChatActive ? "bg-white" : "bg-transparent"}`}
                            >
                                <FiMessageSquare
                                    className={`h-5 w-5 ${isChatActive ? "text-[#1D2F38]" : "text-white"}`}
                                />
                            </div>
                            <span
                                className={`${textClass(isActive("/chat"))}`}
                            >
                                {t("Messages")}
                            </span>
                            {chatCount > 0 && (
                                <span
                                    className="absolute end-1 bottom-6 z-10 flex h-3 w-3 items-center justify-center rounded-full bg-[#DE4437] p-2 text-[12px] font-bold text-white"
                                >
                                    {chatCount > 99 ? "99+" : chatCount}
                                </span>
                            )}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/addnotifi"
                            className={`relative ${baseItemClass} ${isNotificationsActive ? "rounded-full bg-white text-[#1D2F38]" : "text-white"}`}
                        >
                            <div
                                className={`rounded-full p-[5px] ${isNotificationsActive ? "bg-white" : "bg-transparent"}`}
                            >
                                <Image
                                    src={flowerIcon}
                                    alt="Alerts"
                                    width={22}
                                    height={22}
                                    className={`rounded-full ${isNotificationsActive ? "text-[#1D2F38]" : "text-white"}`}
                                />
                            </div>
                            <span
                                className={`${textClass(isActive("/addnotifi"))}`}
                            >
                                {t("Alerts")}
                            </span>
                            {notificationCount > 0 && (
                                <span
                                    className="absolute end-1 bottom-6 z-10 flex h-3 w-3 items-center justify-center rounded-full bg-[#0eb3c9] p-2 text-[12px] font-bold text-white"
                                >
                                    {notificationCount > 99 ? "99+" : notificationCount}
                                </span>
                            )}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
