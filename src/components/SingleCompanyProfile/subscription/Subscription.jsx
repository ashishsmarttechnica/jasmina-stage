"use client";
import { getAllMemberships } from "@/api/membership.api";
import MobileCompanyProfile from "@/common/MobileCompanyProfile";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PaymentModal from "../../../modal/PaymentModal";
import SubscriptionCard from "./SubscriptionCard";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Subscription = () => {
  const params = useParams();
  const companyId = params?.id; // Get companyId from URL params
  const queryClient = useQueryClient();
  const t = useTranslations("Subscription");

  const {
    data: membershipData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["memberships", companyId],
    queryFn: () => getAllMemberships(companyId),
    enabled: !!companyId,
  });

  const [paymentScreen, setPaymentScreen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [stripeElement, setStripeElement] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  const handleUpgrade = (plan) => {
    // console.log(plan, "plan 546546");

    const formattedPlan = {
      ...plan,
      membershipId: plan._id,
      employeeRange: {
        min: plan.employeeRange?.min || 0,
        max: plan.employeeRange?.max || 0,
      },
      eligibility: plan.eligibility || "Basic support",
      price: Number(plan.price) || 0,
    };
    setSelectedPlan(formattedPlan);
    setPaymentScreen(true);
  };

  const handlePlanPurchased = useCallback((plan) => {
    setCurrentPlan(plan);
    setPaymentScreen(false);
    setSuccessModal(true);
    // Save purchased plan to localStorage for persistence
    localStorage.setItem("currentPlan", JSON.stringify(plan));
  }, []);

  // Initialize Stripe elements when modal is opened
  useEffect(() => {
    if (!paymentScreen || !selectedPlan) return;

    const initializeStripeElement = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe not initialized");

        const appearance = {
          variables: {
            fontFamily: "Sohne, system-ui, sans-serif",
            fontWeightNormal: "500",
            borderRadius: "8px",
            colorPrimary: "#7C81EB",
            colorText: "white",
            colorTextSecondary: "white",
            colorTextPlaceholder: "#727F96",
          },
          rules: {
            ".Tab": { backgroundColor: "#0A2540" },
            ".Tab--selected": { backgroundColor: "#7C81EB", color: "#1A1B25" },
            ".Input": {
              backgroundColor: "transparent",
              border: "1.5px solid #7C81EB",
            },
          },
        };

        const elements = stripe.elements({ appearance });
        const card = elements.create("card", {
          style: {
            base: {
              fontFamily: appearance.variables.fontFamily,
              fontWeight: appearance.variables.fontWeightNormal,
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
              backgroundColor: "transparent",
            },
            invalid: {
              color: "#9e2146",
            },
          },
        });

        card.mount("#card-element");
        setStripeElement(card);
      } catch (err) {
        console.error(err);
        toast.error("Failed to initialize payment form.");
      }
    };

    initializeStripeElement();
  }, [paymentScreen, selectedPlan]);

  useEffect(() => {
    // Check localStorage first for current plan, then fall back to API data
    const storedPlan = localStorage.getItem("currentPlan");
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan);
        setCurrentPlan(parsedPlan);
      } catch (error) {
        console.error("Error parsing stored plan:", error);
        localStorage.removeItem("currentPlan"); // Clear invalid data
      }
    } else if (membershipData?.data?.memberships) {
      // Fall back to API data if no stored plan
      setCurrentPlan(
        membershipData.data.memberships.find((plan) => plan.isActive) ||
        membershipData.data.memberships[0]
      );
    }
  }, [membershipData]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">{t("loading")}</div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center text-red-500">
        {t("error")}
      </div>
    );
  }

  // const subscriptionPlans = membershipData?.data || [];
  const subscriptionPlans = membershipData?.data?.memberships || [];

  return (
    <div className="p-2">
      {/* Mobile Company Profile - Only visible on small screens */}
      <div className="lg:hidden mb-6">
        <MobileCompanyProfile />
      </div>

      <h2 className="mb-2 text-center text-[22px] font-medium">{t("title")}</h2>
      <p className="mx-auto mb-8 max-w-[400px] text-center text-[13px] text-gray-600">{t("subtitle")}</p>
      <p className="mx-auto text-red-400 mb-8 max-w-[500px] text-center text-[15px] text-gray-600 ">{t("paymentcode")}</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {subscriptionPlans.map(
          (plan) => (
            // console.log(plan, "plan 546546"),
            (
              <SubscriptionCard
                key={plan._id}
                title={plan.title}
                rejectReason={plan.adminReason}
                price={plan.price}
                eligibility={plan.eligibility}
                employeeRange={plan.employeeRange}
                suitable={plan.suitable}
                membershipActive={plan.membershipActive}
                isActive={plan.isActive}
                isCurrentPlan={currentPlan && plan._id === currentPlan._id}
                handleUpgrade={() => handleUpgrade(plan)}
                newMembershipId={plan._id}
                queryClient={queryClient} // <-- pass queryClient
                companyId={companyId} // <-- pass companyId
              />
            )
          )
        )}
      </div>

      {/* {currentPlan && (
        <div className="mt-8 rounded-lg bg-white px-20 py-4">
          <h3 className="mb-4 text-center text-xl font-semibold">Current Plan</h3>
          <div className="bg-primary flex items-center justify-between rounded-lg p-4 text-white">
            <div>
              <div className="font-semibold">{currentPlan.title}</div>
              <div className="text-sm">
                Eligibility: {currentPlan.employeeRange.min} to {currentPlan.employeeRange.max}{" "}
                employees
              </div>
            </div>
            <div className="text-primary hover:bg-primary rounded-sm bg-white px-6 py-2 text-[18px] hover:text-white">
              €{currentPlan.price}
            </div>
          </div>
        </div>
      )} */}

      <PaymentModal
        stripePromise={stripePromise}
        paymentModal={paymentScreen}
        selectedPlan={selectedPlan}
        setPaymentModal={setPaymentScreen}
        setSuccessModal={setSuccessModal}
        successModal={successModal}
        stripeElement={stripeElement}
        loginUser={membershipData?.user}
        companyId={companyId}
        onPlanPurchased={handlePlanPurchased}
        currentPlan={currentPlan}
        queryClient={queryClient} // <-- pass queryClient
      />
    </div>
  );
};

export default Subscription;
