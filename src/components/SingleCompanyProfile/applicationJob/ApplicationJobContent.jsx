"use client";

import MainCompanyProfile from "@/common/MainCompanyProfile";
import UserMightKnow from "@/common/UserMightKnow";
import CompanyConnectionsLayout from "@/layout/CompanyConnectionsLayout";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Applications from "../applications/Applications";

const ApplicationJobContent = () => {
  const [mainContent, setMainContent] = useState(null);
  const t = useTranslations("Applications");
  const userData = {
    companyName: t("companyNamePlaceholder"),
  };

  const handleContentChange = (content) => {
    setMainContent(content);
  };

  return (
    <>
      <CompanyConnectionsLayout
        RightComponents={[
          <MainCompanyProfile
            key="right2"
            title={userData?.companyName}
            userData={userData}
            onContentChange={handleContentChange}
          />,
          <UserMightKnow key="right1" />,
        ]}
      >
        <div className="w-full space-y-4 sm:space-y-5">
          <Applications />
        </div>
      </CompanyConnectionsLayout>
    </>
  );
};

export default ApplicationJobContent;
