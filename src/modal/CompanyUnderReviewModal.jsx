"use client";
import { useTranslations } from "next-intl";
import { Modal } from "rsuite";
import useAuthStore from "../store/auth.store";
import useReviewStore from "../store/verify.store";

const CompanyUnderReviewModal = () => {
    const { isReviewModalOpen, closeReviewModal } = useReviewStore();
    const t = useTranslations("CompanyVerificationModal");
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        onClose && onClose();
    };

    if (!isReviewModalOpen) return null;

    return (
        <Modal
            open={isReviewModalOpen}
            onClose={closeReviewModal}
            size="sm"
            className="mx-auto w-full max-w-lg rounded-2xl !p-0"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton={true} className="flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-white px-6 py-4">
                <Modal.Title className="text-xl font-bold text-gray-800">{t("verificationRequired")}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="space-y-4 bg-white px-6 py-4">
                <p className="text-gray-600">{t("messages.companyNotVerified")}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-700 text-white px-4 py-2 rounded-lg "
                    >
                        {t("buttons.logout")}
                    </button>
                    <button
                        onClick={closeReviewModal}
                        className="bg-primary text-white px-4 py-2 rounded-lg"
                    >
                            {t("buttons.close")}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CompanyUnderReviewModal;


