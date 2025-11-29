import { useTranslations } from "next-intl";
import { Modal } from "rsuite";

const PostJobErrorModal = ({ isOpen, onClose, message, title = "Unable to Post Job" }) => {
    const t = useTranslations("CompanyVerificationModal");

    const handleClose = () => {
        onClose && onClose();
    };

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
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 22 22" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-600 leading-relaxed mt-1">
                            {message || "An error occurred while trying to post a job. Please try again later."}
                        </p>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-white transition-colors"
                    >
                        {t("buttons.close") || "Close"}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PostJobErrorModal;
