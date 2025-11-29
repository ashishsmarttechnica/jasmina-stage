"use client";
import { Link, useRouter } from "@/i18n/navigation";
import useAuthStore from "@/store/auth.store";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import HeaderLogoLink from "./HeaderLogoLink";
import MultiLanguageDropdown from "./MultiLanguageDropdown";

const Header = ({ isLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const logoHref = "/";
  const pathname = usePathname();

  // ✅ Disable background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      <div className="sticky top-0 z-50">


        <header className="bg-headerbg w-full py-[7px]">
          <div className="container mx-auto px-2 md:px-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeaderLogoLink logoHref={logoHref} />
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-2xl text-white md:hidden"
                aria-label="Toggle Menu"
              >
                {isOpen ? <IoClose /> : <GiHamburgerMenu />}
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden text-white md:flex md:items-center md:gap-6">
                <MultiLanguageDropdown />
                {isLogin ? (
                  <ul className="flex gap-2">
                    <li>
                      <button
                        className={`rounded-sm p-2 text-[13px] transition-all duration-100 ease-in sm:px-3 sm:py-2 ${pathname === "/login" ? "text-primary bg-green-300" : "bg-secondary text-primary hover:bg-primary hover:text-secondary"}`}
                        onClick={() => {
                          logout();
                          router.push("/login");
                          toast.success(t("logoutSuccess"));
                        }}
                      >
                        {t("logout")}
                      </button>
                    </li>
                  </ul>
                ) : (
                  <ul className="flex gap-2">
                    <li>
                      <Link
                        href="/login"
                        className={`rounded-sm p-2 text-[13px] transition-all duration-100 ease-in sm:px-3 sm:py-2 ${pathname === "/en/login"
                          ? "bg-primary text-white"
                          : "bg-secondary text-primary hover:bg-primary hover:text-white"
                          }`}
                      >
                        {t("login")}
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/signup"
                        className={`rounded-sm p-2 text-[13px] transition-all duration-100 ease-in sm:px-3 sm:py-2 ${pathname === "/en/signup" ? "bg-primary text-white" : "bg-secondary text-primary hover:bg-secondary hover:text-primary"}`}
                      >
                        {t("SignUp")}
                      </Link>
                    </li>
                  </ul>
                )}
              </nav>
            </div>
          </div>

          {/* Mobile Side Drawer */}
          <div
            dir={locale}
            className={`bg-headerbg fixed top-0 z-50 h-screen w-64 transform text-white transition-transform duration-300 ease-in-out md:hidden ${isRTL ? "left-0" : "right-0"
              } ${isOpen ? "translate-x-0" : isRTL ? "-translate-x-full" : "translate-x-full"}`}
          >
            <div className={`flex ${isRTL ? "justify-start" : "justify-end"} p-4`}>
              <button onClick={() => setIsOpen(false)} aria-label="Close Menu" className="text-white">
                <IoClose className="text-3xl" />
              </button>
            </div>
            <div className={`flex flex-col gap-4  px-2  py-5`}>
              <MultiLanguageDropdown />
              {isLogin ? (
                <ul className="flex flex-col gap-2">
                  <li>
                    <button
                      className={`w-full rounded-sm p-2 text-left text-[13px] transition-all duration-100 ease-in sm:px-3 sm:py-2 ${pathname === "/en/login"
                        ? "text-primary bg-green-300"
                        : "bg-secondary text-primary hover:bg-primary hover:text-secondary"
                        }`}
                      onClick={() => {
                        logout();
                        router.push("/login");
                        toast.success(t("logoutSuccess"));
                        setIsOpen(false);
                      }}
                    >
                      {t("logout")}
                    </button>
                  </li>
                </ul>
              ) : (
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link
                      href="/login"
                      className={`block w-full rounded-sm p-2 text-[13px] transition-all duration-100 ease-in sm:px-3 sm:py-2 ${pathname === "/en/login"
                        ? "bg-primary text-white"
                        : "bg-secondary text-primary hover:bg-primary hover:text-white"
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t("login")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className={`block w-full rounded-sm p-2 text-[13px] transition-all duration-100 ease-in sm:px-3 sm:py-2 ${pathname === "/en/signup"
                        ? "bg-primary text-white"
                        : "bg-secondary text-primary hover:bg-secondary hover:text-primary"
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t("SignUp")}
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
          )}
        </header>
      </div>
    </>
  );
};

export default Header;
