"use client";
import noImage2 from "@/assets/feed/no-img.png";
import ImageFallback from "@/common/shared/ImageFallback";
import { usePathname, useRouter } from "@/i18n/navigation";
import getImg from "@/lib/getImg";
import useAuthStore from "@/store/auth.store";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsFileEarmarkText } from "react-icons/bs";
import { FiChevronDown, FiUser } from "react-icons/fi";
import { MdSettings } from "react-icons/md";
import { RiHandCoinLine } from "react-icons/ri";
import { toast } from "react-toastify";

const MobileCompanyProfile = ({ customMenuItems = [] }) => {
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);
    const t = useTranslations("CompanyProfile");
    const userId = user?._id;
    const [isOpen, setIsOpen] = useState(false); // Changed to true for default open
    const [isAnimating, setIsAnimating] = useState(false);
    const contentRef = useRef(null);

    const handleMenuClick = (item) => {
        if (item.isLogout) {
            logout();
            router.push("/login");
            toast.success(t("LogoutSuccess"));
            // Only close dropdown for logout
            setIsOpen(false);
        } else if (pathname !== item.path) {
            router.push(item.path);
            // Don't close dropdown for navigation - let user close it manually
        }
        // Removed setIsOpen(false) from here
    };

    const toggleDropdown = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setIsOpen(!isOpen);
        }
    };

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isAnimating]);

    // Default menu items
    const defaultMenuItems = [
        {
            icon: (isActive) => (
                <FiUser className={`text-lg ${isActive ? "text-primary" : "text-gray-500"}`} />
            ),
            label: t("Profile"),
            path: `/company/single-company/${userId}`,
        },
        {
            icon: (isActive) => (
                <BsFileEarmarkText className={`text-lg ${isActive ? "text-primary" : "text-gray-500"}`} />
            ),
            label: t("ReviewApplications"),
            path: `/company/single-company/${userId}/applications`,
        },
        {
            icon: (isActive) => (
                <RiHandCoinLine className={`text-lg ${isActive ? "text-primary" : "text-gray-500"}`} />
            ),
            label: t("Interview"),
            path: `/company/single-company/${userId}/interview`,
        },
        {
            icon: (isActive) => (
                <MdSettings className={`text-lg ${isActive ? "text-primary" : "text-gray-500"}`} />
            ),
            label: t("Settings"),
            path: `/company/single-company/${userId}/settings`,
        },
        {
            icon: (isActive) => (
                <RiHandCoinLine className={`text-lg ${isActive ? "text-primary" : "text-gray-500"}`} />
            ),
            label: t("Subscription"),
            path: `/company/single-company/${userId}/subscription`,
        },
        {
            icon: (isActive) => (
                <RiHandCoinLine className={`text-lg ${isActive ? "text-primary" : "text-gray-500"}`} />
            ),
            label: t("PreviousPlans"),
            path: `/company/single-company/${userId}/previousplans`,
        },
        {
            icon: (isActive) => (
                <BiLogOut className={`text-lg ${isActive ? "text-red-500" : "text-gray-500"}`} />
            ),
            label: t("Logout"),
            isLogout: true,
            path: "/logout",
        },
    ];

    // Use custom menu items if provided, otherwise use default
    const menuItems = customMenuItems.length > 0 ? customMenuItems : defaultMenuItems;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Trigger Button */}
            <button
                onClick={toggleDropdown}
                className="flex w-full items-center justify-between px-3 py-2 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={user?.logoUrl && getImg(user.logoUrl)}
                        loading="lazy"
                        width={40}
                        height={40}
                        fallbackSrc={noImage2}
                        alt={user?.companyName ?? "Company"}
                        className="h-10 w-10 rounded-full border-2 border-gray-100"
                    />
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">{user?.companyName}</p>
                        <p className="text-xs text-gray-500">Company Profile</p>
                    </div>
                </div>
                <FiChevronDown
                    className={`text-gray-400 transition-all duration-300 ease-out transform ${isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
                        }`}
                />
            </button>

            {/* Slide Down Menu */}
            <div
                ref={contentRef}
                className={`transition-all duration-300 ease-out overflow-hidden ${isOpen
                    ? 'max-h-[500px] opacity-100 transform translate-y-0'
                    : 'max-h-0 opacity-0 transform -translate-y-2'
                    }`}
                style={{
                    transitionProperty: 'max-height, opacity, transform',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div className="border-t border-gray-100 bg-gray-50/30">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={index}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${isActive ? 'bg-primary/10 border-r-2 border-primary shadow-sm' : ''
                                    }`}
                                onClick={() => handleMenuClick(item)}
                                style={{
                                    transform: isOpen ? 'translateX(0)' : 'translateX(-10px)',
                                    opacity: isOpen ? 1 : 0,
                                    transitionDelay: `${index * 50}ms`
                                }}
                            >
                                {typeof item.icon === "function" ? item.icon(isActive) : item.icon}
                                <span className={`text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary' :
                                    item.isLogout ? 'text-red-600' : 'text-gray-700'
                                    }`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileCompanyProfile;
