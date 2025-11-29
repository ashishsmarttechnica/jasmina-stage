"use client";
// import logo from "@/assets/form/logo.png";
// import Image from "next/image";
import { useTranslations } from "next-intl";

export default function DefaultChatView() {
  const t = useTranslations("Chat");
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          {/* <Image src={logo} alt="Chat Logo" className="" /> */}
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">{t("defaultView.title")}</h2>
        <p className="text-sm text-gray-500">{t("defaultView.description")}</p>
      </div>
    </div>
  );
}
