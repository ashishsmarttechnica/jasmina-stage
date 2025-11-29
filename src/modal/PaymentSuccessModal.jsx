import { useTranslations } from "next-intl";
import { Modal } from "rsuite";
const PaymentSuccessModal = ({ open, onClose, purchasedPlan }) => {
  const t = useTranslations("Payment");
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-2 flex items-center justify-center">
              <svg
                className="text-primary h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fff" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2l4-4"
                  stroke="#0f8200"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <span className="text-primary text-2xl font-bold">{t("PaymentSuccessful")}</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center justify-center rounded-lg p-2">
          <p className="mb-6 text-lg text-gray-700">
            {t("success.subscriptionUpgrad")}
          </p>
          {purchasedPlan && (
            <div className="mb-6 w-full max-w-md rounded-xl border border-green-200 bg-white p-6 shadow-lg">
              <div className="mb-2 text-center">
                <span className="text-primary text-lg font-semibold">{purchasedPlan.title}</span>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">{t("EmployeeRange")} :</span>
                  <span>
                    {purchasedPlan.employeeRange.min} - {purchasedPlan.employeeRange.max}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("Price")} :</span>
                  <span className="text-primary font-bold">€{purchasedPlan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("PurchaseDate")} :</span>
                  <span>{new Date(purchasedPlan.purchase_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("ExpireDate")} :</span>
                  <span>{new Date(purchasedPlan.expire_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="from-primary to-primary hover:from-primary hover:to-primary focus:ring-primary mt-2 rounded-full bg-gradient-to-r px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            {t("Close")}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default PaymentSuccessModal;
