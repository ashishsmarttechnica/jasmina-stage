import { Modal } from "rsuite";
import EditCompany from "./EditCompany";
import { useTranslations } from "next-intl";
const EdicCompanyProfileModal = ({ open, onClose, userData }) => {
  const t=useTranslations('CompanyProfile.singleCompany');

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      className="mx-auto w-full max-w-lg rounded-2xl !p-0"
    >
      <Modal.Header className="flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-white px-0 py-4">
        <Modal.Title className="text-xl font-bold text-gray-800">{t("editProfile")}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="space-y-6 bg-white px-2 py-4">
        <EditCompany userData={userData} onClose={onClose} />
      </Modal.Body>
    </Modal>
  );
};

export default EdicCompanyProfileModal;
