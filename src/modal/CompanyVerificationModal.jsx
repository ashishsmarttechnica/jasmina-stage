import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Modal } from "rsuite";
import useAuthStore from "../store/auth.store";
import CompanyUnderReviewModal from "./CompanyUnderReviewModal";

const CompanyVerificationModal = ({ isOpen, onClose, message }) => {
  console.log("CompanyVerificationModal received message:", message);
  console.log("CompanyVerificationModal isOpen:", isOpen);

  const subscriptionMessage =
    "You've used your 2 free job post. To post more, please upgrade your plan.";
  const expiredPlanMessage = "Your plan has expired. Please upgrade to continue.";
  const companyNotVerifiedMessage = "Profile under review – full access after approval.";
  const accountBlockedMessage = "Your account has been blocked";

  const t = useTranslations("CompanyVerificationModal");
  const router = useRouter();
  const { user } = useAuthStore();
  const userId = user?._id;

  // Don't show modal if account is blocked
  if (message === accountBlockedMessage) {
    return null;
  }

  const isSubscriptionRelated =
    message === subscriptionMessage || message === expiredPlanMessage;

  const title = isSubscriptionRelated
    ? t("subscriptionRequired")
    : t("verificationRequired");

  const handleSubscriptionClick = () => {
    router.push(`/company/single-company/${userId}/subscription`);
    onClose && onClose();
  };

  const handleClose = () => {
    onClose && onClose();
  };

  // If it's the company verification message, render dedicated modal
  if (message === companyNotVerifiedMessage) {
    return <CompanyUnderReviewModal isOpen={isOpen} onClose={onClose} />;
  }

  const displayMessage =
    message === subscriptionMessage
      ? t("messages.subscriptionLimit")
      : message === expiredPlanMessage
        ? t("messages.planExpired")
        : message;

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      size="sm"
      className="mx-auto w-full max-w-lg rounded-2xl !p-0"
    >
      <Modal.Header closeButton={true} className="flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-white px-6 py-4">
        <Modal.Title className="text-xl font-bold text-gray-800">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="space-y-4 bg-white px-6 py-4">
        <p className="text-gray-600">{displayMessage}</p>
        <div className="flex justify-end">
          {message === subscriptionMessage || message === expiredPlanMessage ? (
            <button
              onClick={handleSubscriptionClick}
              className="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-white transition-colors"
            >
              {t("buttons.subscriptionPurchase")}
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-white transition-colors"
            >
              {t("buttons.close")}
            </button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CompanyVerificationModal;
