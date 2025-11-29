"use client";
import useCompanyVerification from "@/hooks/company/useCompanyVerification";
import { useRouter } from "@/i18n/navigation";
import CompanyVerificationModal from "@/modal/CompanyVerificationModal";
import PostJobErrorModal from "@/modal/PostJobErrorModal";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaRegSquarePlus } from "react-icons/fa6";
import { Loader } from "rsuite";
import useCompanyVerificationStore from "../../store/companyVerification.store";
import useNewJobPostStore from "../../store/newjobpost.store";

const CreateJobButton = ({ isMobile, baseItemClass, iconClass, textClass, isActive }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPostJobErrorModal, setShowPostJobErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusCode, setStatusCode] = useState(null);
  const t = useTranslations("CompanyMainFeed");
  const message = useNewJobPostStore((s) => s.message);
  const isverified = useNewJobPostStore((s) => s.isverified);

  // Use the verification store directly
  const {
    isVerified,
    isLoading: storeLoading,
    error,
    message: storeMessage,
    statusCode: storeStatusCode,
    checkVerification
  } = useCompanyVerificationStore();

  const {
    isLoading: isVerificationLoading,
    refetch: refetchVerification,
  } = useCompanyVerification();

  console.log("verificationData in CreateJobButton:", message);
  console.log("showVerificationModal state:", showVerificationModal);
  console.log("Store verification state:", { isVerified, storeLoading, error, storeMessage });
  console.log("Modal props:", { isOpen: showVerificationModal, message: storeMessage || message });

  // Monitor modal state changes
  useEffect(() => {
    console.log("Modal state changed:", showVerificationModal);
  }, [showVerificationModal]);

  // Test function to manually show modal
  const testModal = () => {
    console.log("Testing modal...");
    setShowVerificationModal(true);
  };

  const handlePostJobClick = async () => {
    setIsLoading(true);
    const companyId = Cookies.get("userId");

    try {
      console.log("Checking company verification for companyId:", companyId);

      // Use the store's checkVerification method directly
      const result = await checkVerification(companyId);

      console.log("Verification result:", result);

      // Only navigate if API call was successful AND verification passed
      if (result && result.success === true) {
        console.log("Company verified successfully, navigating to create-job");
        router.refresh();
        router.push("/company/create-job");
      } else {
        // If API failed or verification failed, show appropriate modal based on status code
        console.log("Company verification failed or API error, showing modal");
        console.log("Error message to show:", result.message);
        console.log("Status code:", result.statusCode);
        console.log("Store message:", storeMessage);

        const currentStatusCode = result.statusCode || storeStatusCode;
        setStatusCode(currentStatusCode);
        setErrorMessage(result.message || storeMessage || "An error occurred while verifying your company.");

        // Show different modals based on status code
        if (currentStatusCode === 505 || currentStatusCode === 506) {
          console.log("Showing PostJobErrorModal for status code:", currentStatusCode);
          setShowPostJobErrorModal(true);
        } else {
          console.log("Showing CompanyVerificationModal for status code:", currentStatusCode);
          setShowVerificationModal(true);
        }
      }
    } catch (error) {
      console.error("Verification check error:", error);
      console.log("API call failed completely, showing PostJobErrorModal");
      // If API call fails completely, show PostJobErrorModal instead of navigating
      setErrorMessage("Network error or API unavailable. Please try again later.");
      setStatusCode(null); // No status code for network errors
      setShowPostJobErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isMobile ? (
        <>
          <button
            className="bg-primary hover:bg-secondary/70 hover:border-primary hover:text-primary mt-0 w-full rounded-[4px] border border-transparent p-1 text-base text-white transition-all duration-200 ease-in disabled:opacity-70 sm:p-2"
            onClick={handlePostJobClick}
            disabled={isLoading || isVerificationLoading || storeLoading}
          >
            {isLoading || isVerificationLoading || storeLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader size="sm" speed="slow" />
                <span>{t("loading")}</span>
              </div>
            ) : (
              t("postJob") || "Post a job"
            )}
          </button>



        </>
      ) : (
        <button
          className={baseItemClass}
          onClick={handlePostJobClick}
          disabled={isLoading || isVerificationLoading || storeLoading}
        >
          {isLoading || isVerificationLoading || storeLoading ? (
            <>
              <Loader size="xs" speed="slow" className="h-5 w-5 text-white" />
              <span className={textClass(false)}>{t("loading")}</span>
            </>
          ) : (
            <>
              <FaRegSquarePlus className={iconClass(isActive("/company/create-job"))} />
              <span className={textClass(isActive("/company/create-job"))}>{t("postJob")}</span>
            </>
          )}
        </button>
      )
      }


      <CompanyVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        message={storeMessage || message}
      />

      <PostJobErrorModal
        isOpen={showPostJobErrorModal}
        onClose={() => setShowPostJobErrorModal(false)}
        message={errorMessage}
        title="Unable to Post Job"
      />
    </>
  );
};

export default CreateJobButton;
