"use client";
import useModalStore from "@/store/modal.store";
import { useTranslations } from "next-intl";
import { Modal } from "rsuite";
import useAuthStore from "../store/auth.store";

export default function UserBlockedModal() {
    const { isUserBlockedModalOpen, closeUserBlockedModal } = useModalStore();
    const { logout } = useAuthStore();
    const t = useTranslations("UserBlockedModal")

    if (!isUserBlockedModalOpen) return null;

    const handleLogout = () => {
        logout();
        closeUserBlockedModal();
    };
    // ye
    return (
        <Modal
            open={isUserBlockedModalOpen}
            onClose={closeUserBlockedModal}
            size="sm"
            className="mx-auto w-full max-w-lg rounded-2xl !p-0"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton={true} className="flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-white px-6 py-4">
                <Modal.Title className="text-xl font-bold text-gray-800">
                    {t("title")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="space-y-4 bg-white px-6 py-4">
                <p className="text-gray-600">
                    {t("message")}
                </p>
                <div className="flex justify-end gap-4">
                    {/* <button
                        onClick={handleLogout}
                        className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
                    >
                        {t("buttons.logout")}
                    </button> */}
                    <button
                        onClick={closeUserBlockedModal}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {t("buttons.close")}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}
