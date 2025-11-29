import { purchasePlan } from "@/api/membership.api";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "rsuite";
import PreviousPlanCard from "../components/SingleCompanyProfile/previousplans/PreviousPlanCard";
import PaymentSuccessModal from "./PaymentSuccessModal";
const PaymentModal = ({
  stripePromise,
  paymentModal,
  selectedPlan,
  setPaymentModal,
  successModal,
  setSuccessModal,
  stripeElement,
  loginUser,
  companyId, // Add companyId to props
  onPlanPurchased, // Add callback prop
  currentPlan, // Add currentPlan to props
  queryClient, // <-- add queryClient prop
}) => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Payment");
  const [paymentData, setPaymentData] = useState({
    email: "",
  });
  const [purchasedPlan, setPurchasedPlan] = useState(null); // Add state for purchased plan
  // Try to get from cookie, fallback to localStorage
  let stripeCustomerId = Cookies.get("stripeCustomerId");
  if (!stripeCustomerId) {
    stripeCustomerId = localStorage.getItem("stripeCustomerId");
    if (stripeCustomerId) {
      Cookies.set("stripeCustomerId", stripeCustomerId, { expires: 30 }); // Optionally restore cookie
    }
  }
  const [activePlanModalOpen, setActivePlanModalOpen] = useState(false);
  const [activePlanModalError, setActivePlanModalError] = useState("");

  // console.log(stripeCustomerId, "stripeCustomerId");
  // const { mutate, isPending, error } = useLogin();
  //// console.log(mutate, "mutate");
  // Store stripeCustomerId from OTP verification in paymentData.custId
  // useEffect(() => {
  //   if (otpData && otpData.data && otpData.data.stripeCustomerId) {
  //     setPaymentData((prev) => ({
  //       ...prev,
  //       custId: otpData.data.stripeCustomerId,
  //     }));
  //   }
  // }, [otpData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email } = paymentData;

    if (!email) {
      toast.error(t("errors.emailRequired"));
      return;
    }

    if (!stripeElement) {
      toast.error(t("errors.formNotInitialized"));
      return;
    }

    if (!stripePromise) {
      toast.error(t("errors.stripeNotConfigured"));
      return;
    }

    try {
      setLoading(true);
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error(t("errors.stripeInitFailed"));
      }
      // Use createToken instead of createPaymentMethod
      const { token, error } = await stripe.createToken(stripeElement, {
        name: paymentData.name || "",
        email: paymentData.email,
        address_line1: paymentData.address_line1 || "",
        address_city: paymentData.address_city || "",
        address_country: paymentData.country || "",
        address_state: paymentData.address_state || "",
        address_zip: paymentData.address_zip || "",
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
      } else {
        await sendTokenToBackend(token);
      }
    } catch (error) {
      console.error("Error creating token:", error);
      toast.error(error.response?.data?.message || error.message || t("errors.paymentFailedGeneric"));
      setLoading(false);
    }
  };

  // Add sendTokenToBackend function
  const sendTokenToBackend = async (token) => {
    try {
      const purchaseData = {
        membershipId: selectedPlan?._id,
        companyId: companyId,
        title: selectedPlan?.title || "",
        price: Number(selectedPlan?.price) || 0,
        employeeRange: `${selectedPlan?.employeeRange?.min || 0}-${selectedPlan?.employeeRange?.max || 0}`,
        eligibility: selectedPlan?.eligibility || "Basic support",
        custId: stripeCustomerId,
        email: paymentData.email,
        payment_status: "success",
        transactionId: token?.id || `txn_${Date.now()}`,
        tokenId: token?.id, // Add tokenId to send to /purchase-plan
      };
      const response = await purchasePlan(purchaseData);
      if (response.success && response.plan) {
        setPurchasedPlan(response.plan);
        setSuccessModal(true);
        setPaymentModal(false);
        toast.success(t("success.planUpgraded"));
        setPaymentData({ email: "" });
        if (onPlanPurchased) onPlanPurchased(response.plan);
        if (queryClient && companyId) {
          queryClient.invalidateQueries(["memberships", companyId]);
        }
      } else {
        throw new Error(response.message || t("errors.paymentFailed"));
      }
    } catch (error) {
      console.error("API Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "";
      if (
        errorMsg ===
        "You already have an active plan. Please wait until it expires before purchasing a new one."
      ) {
        setActivePlanModalError(errorMsg);
        setActivePlanModalOpen(true);
      } else {
        toast.error(errorMsg || t("errors.paymentFailedGeneric"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const wrapper = document.querySelector(".rs-modal-wrapper");
    if (wrapper) {
      wrapper.classList.add("custom-no-padding");
    }

    return () => {
      if (wrapper) {
        wrapper.classList.remove("custom-no-padding");
      }
    };
  }, [paymentModal]);

  return (
    <>
      <Modal
        open={paymentModal}
        onClose={() => setPaymentModal(false)}
        className="modal-p-0 w-full select-none lg:max-w-[991px]"
      >
        <div className="px-4 pb-4">
          <div className="absolute top-0 right-0 z-20 p-2">{/* <SecureBanner /> */}</div>
          <div className="sticky top-0 z-10 bg-white pt-4 pb-4">
            <h4 className="mb-6 text-xl font-semibold text-gray-800">{selectedPlan?.title}</h4>
            <p className="text-gray-600">{t("planDetails")}</p>
          </div>
          <div className="mb-4">
            <div className="grid grid-cols-1 gap-2 text-gray-700">
              <div className="flex items-center justify-between rounded-md border border-slate-200 px-2 py-2">
                <div className="font-medium">👥 {t("employeeRange")}:</div>
                <div>
                  {selectedPlan?.employeeRange?.min} - {selectedPlan?.employeeRange?.max}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border border-slate-200 px-2 py-2">
                <div className="font-medium">✨ {t("eligibility")}:</div>
                <div>{selectedPlan?.eligibility}</div>
              </div>

              <div className="flex items-center justify-between rounded-md border border-slate-200 px-2 py-2">
                <div className="font-medium">💰 {t("price")}:</div>
                <div className="font-semibold text-green-600">€{selectedPlan?.price}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="w-full">
              <label htmlFor="card-element" className="mb-1 ml-1 text-sm text-gray-600">
                {t("cardDetails")}
              </label>
              <div className="rounded-md border border-gray-300 bg-white p-0">
                <div
                  id="card-element"
                  className="min-h-[45px] w-full"
                  style={{ padding: "10px" }}
                ></div>
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="email" className="mb-1 ml-1 text-sm text-gray-600">
                {t("email")}
              </label>
              <input
                type="email"
                id="email"
                placeholder={t("emailPlaceholder")}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:ring-1 focus:ring-black focus:outline-none"
                value={paymentData.email}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="xm:text-sm bg-primary hover:text-primary border-primary rounded-full border px-4 py-2 text-center text-xs font-medium text-white transition-all duration-300 ease-in-out hover:scale-95 hover:bg-white sm:px-6 sm:leading-[28px] xl:text-[18px]"
                disabled={loading}
              >
                {loading ? t("processing") : t("payNow")}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Success Modal extracted to its own component */}
      <PaymentSuccessModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
        purchasedPlan={purchasedPlan}
      />

      <Modal
        open={activePlanModalOpen}
        onClose={() => setActivePlanModalOpen(false)}
        className="modal-p-0 w-full select-none lg:max-w-[900px]"
      >
        <div className="p-6 text-center">
          <h4 className="mb-4 text-lg font-semibold text-red-600">{activePlanModalError}</h4>
          <PreviousPlanCard companyId={companyId} />
          <button
            className="bg-primary hover:bg-primary/80 mt-6 rounded px-4 py-2 text-white"
            onClick={() => setActivePlanModalOpen(false)}
          >
            {t("close")}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default PaymentModal;
