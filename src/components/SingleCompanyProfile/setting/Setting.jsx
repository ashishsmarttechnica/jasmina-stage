"use client";
import MobileCompanyProfile from "@/common/MobileCompanyProfile";
import useAuthStore from "@/store/auth.store";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PasswordResetModal from "../../../modal/passwordReset/PasswordResetModal";

const Setting = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { user } = useAuthStore();
  const t = useTranslations("Settings");

  const handleResentPassword = () => {
    setIsPasswordModalOpen(true);
  };
  return (
    <div className="space-y-2">
      {/* Mobile Company Profile - Only visible on small screens */}
      <div className="lg:hidden mb-6">
        <MobileCompanyProfile />
      </div>
      <div className="flex cursor-pointer items-center justify-between rounded-sm border-b border-gray-100 bg-white px-5 py-4 hover:bg-gray-50">
        <div className="block" onClick={() => handleResentPassword()}>
          <h3 className="text-[14px] font-medium"></h3>
          <p className="text-[16px] font-medium">{t("changePassword")}</p>
        </div>
      </div>
      <div className="flex cursor-pointer items-center justify-between rounded-sm border-b border-gray-100 bg-white px-5 py-4 hover:bg-gray-50">
        <div className="block">
          <h3 className="text-[14px] font-medium"></h3>
          <p className="text-[16px] font-medium">{t("preference")}</p>
        </div>
      </div>
      <div className="flex cursor-pointer items-center justify-between rounded-sm border-b border-gray-100 bg-white px-5 py-4 hover:bg-gray-50">
        <div className="block">
          <h3 className="text-[14px] font-medium"></h3>
          <p className="text-[16px] font-medium">{t("billingInfo")}</p>
        </div>
      </div>
      <div className="flex cursor-pointer items-center justify-between rounded-sm border-b border-gray-100 bg-white px-5 py-4 hover:bg-gray-50">
        <div className="block">
          <h3 className="text-[14px] font-medium"></h3>
          <p className="text-[16px] font-medium">{t("termsAndConditions")}</p>
        </div>
      </div>
      <PasswordResetModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userData={user}
      />
    </div>
  );
};

export default Setting;
