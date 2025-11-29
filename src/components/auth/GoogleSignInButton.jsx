"use client";
import GoogleIcon from "@/assets/form/GoogleIcon.png";
import useGoogleAuth from "@/hooks/auth/useGoogleAuth";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import AccountTypeModal from "./AccountTypeModal";

const GoogleSignInButton = () => {
  const t = useTranslations("auth");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleGoogleSignIn, isLoading } = useGoogleAuth();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAccountTypeSelection = (accountType) => {
    handleGoogleSignIn(accountType);
  };

  return (
    <>
      <div
        className="bg-gray mx-auto flex max-w-65.5 cursor-pointer items-center justify-center rounded-md py-[13px]"
        onClick={openModal}
      >
        <Image
          src={GoogleIcon}
          alt={t("GoogleIconAltImgSignUp")}
          width={24}
          height={24}
          className="mr-2 h-6 w-6"
        />
        <span>{t("ContinueWithGoogle")}</span>
      </div>

      <AccountTypeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelectAccountType={handleAccountTypeSelection}
        isLoading={isLoading}
      />
    </>
  );
};

export default GoogleSignInButton;