"use client";
import Image from "next/image";
import React from "react";
import Logo from "@/assets/form/Logo.png";
import CreateCompany from "@/components/company/CreateCompany";
import ReusableForm from "@/components/form/ReusableForm";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("CompanyProfile.profile");
  return (
    <div className=" flex justify-center py-10">
      <div className="w-full">
        <div className="flex items-center justify-center md:mt-4 mb-2.5">
          <Image src={Logo} alt="Logo" width={206} height={53} />
        </div>
        <ReusableForm
          title={t("title")}
          shorttitle={t("shorttitle")}
          maxWidth="max-w-[699px]"
          subtitle={t("subTitle")}
        >
          <CreateCompany />
        </ReusableForm>
      </div>
    </div>
  );
};

export default Page;
