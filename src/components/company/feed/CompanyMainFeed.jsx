"use client";

import CreateJobButton from "@/common/button/CreateJobButton";
import UserCompanyProfile from "@/common/UserCompanyProfile";
import UserConnections from "@/common/UserConnections";
import UserMightKnow from "@/common/UserMightKnow";
import UserNetworkInvites from "@/common/UserNetworkInvites";
import FeedPost from "@/components/user/feed/FeedPost";
import { useCompanyVerification } from "@/hooks/company/useCompanyVerification";
import MainLayout from "@/layout/MainLayout";
import CompanyVerificationModal from "@/modal/CompanyVerificationModal";
import useNewJobPostStore from "@/store/newjobpost.store";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import CompanyConnections from "../../../common/CompanyConnections";

const CompanyMainFeed = () => {
  const t = useTranslations("CompanyMainFeed");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { message } = useNewJobPostStore();

  // Use the company verification hook
  const { data: verificationData, isLoading } = useCompanyVerification();

  // Check if the message indicates profile is under review or company is not verified
  useEffect(() => {
    if (message && (
      message.includes("Profile under review – full access after approval.") ||
      message.includes("Profile under review – full access after approval.")
    )) {
      setShowVerificationModal(true);
    }
  }, [message]);

  const handleCloseModal = () => {
    setShowVerificationModal(false);
  };

  return (
    <>
      <MainLayout
        leftComponents={[
          <UserCompanyProfile key="left1" />,
          <UserConnections key="left2" title={t("userConnections")} />,
          <CompanyConnections key="left3" title={t("companyConnections")} />,
        ]}
        rightComponents={[
          <CreateJobButton key="right1" />,
          <UserMightKnow key="right2" />,
          <UserNetworkInvites
            key="right3"
            title={t("networkInvites")}
            type="invites"
            buttonType="invite"
          />,
        ]}
      >
        <FeedPost />
      </MainLayout>

      {/* Company Verification Modal */}
      <CompanyVerificationModal
        isOpen={showVerificationModal}
        onClose={handleCloseModal}
        message={message || "Profile under review – full access after approval."}
      />
    </>
  );
};

export default CompanyMainFeed;