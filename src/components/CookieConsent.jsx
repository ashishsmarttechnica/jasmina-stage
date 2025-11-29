"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeaderLogo from "@/assets/form/HeaderLogo.png";
import { useTranslations } from "next-intl";

    function getCookie(name) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";")[0];
    return null;
    }

    function setCookie(name, value, days) {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
    }

export default function CookieConsent() {
  const t = useTranslations("CookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getCookie("cookie_consent");
    if (!existing) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie("cookie_consent", "accepted", 180);
    setVisible(false);
  };

  const handleReject = () => {
    setCookie("cookie_consent", "rejected", 30);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 z-[1000] mx-auto max-w-xl rounded-xl border bg-white/95 shadow-2xl backdrop-blur md:left-5 md:right-auto" style={{ borderColor: "var(--primary)" }}>
      <div className="flex gap-4 p-4 md:p-5">
        <div className="mt-1 hidden h-10 w-10 flex-none items-center justify-center rounded-lg md:flex" style={{ backgroundColor: "rgba(15,130,0,0.08)", color: "var(--primary)" }}>
          <Image src={HeaderLogo} alt="Logo" width={24} height={24} className="h-6 w-6 object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-sm font-semibold text-gray-900">{t("title")}</p>
          <p className="text-sm leading-5 text-gray-700">
            {t("description")}
          </p>
          <div className="mt-3 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {/* <a href="/privacy-policy" className="text-xs  underline underline-offset-2" style={{ color: "var(--primary)" }}>
              Learn more in our Privacy Policy
            </a> */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t("reject")}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


