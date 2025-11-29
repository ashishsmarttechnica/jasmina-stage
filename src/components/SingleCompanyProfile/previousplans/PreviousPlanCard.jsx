"use client";
import MobileCompanyProfile from "@/common/MobileCompanyProfile";
import { usePreviousPlans } from "@/hooks/company/usePreviousPlans";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import PlanCard from "./PlanCard";

const PreviousPlanCard = ({ companyId }) => {
  const t = useTranslations("PreviousPlans");
  const { data, isLoading } = usePreviousPlans(companyId);
  const plans = data?.data || [];

  if (isLoading) {
    return (
      <div className="w-full">
        {/* Mobile Company Profile - Only visible on small screens */}
        <div className="lg:hidden mb-6">
          <MobileCompanyProfile />
        </div>

        <div className="flex min-h-[400px] w-full items-center justify-center px-4 sm:min-h-[512px]">
          <div className="text-center">{t("loading")}</div>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="w-full">
        {/* Mobile Company Profile - Only visible on small screens */}
        <div className="lg:hidden mb-6">
          <MobileCompanyProfile />
        </div>

        <div className="flex min-h-[400px] w-full items-center justify-center px-4 sm:min-h-[512px]">
          <div className="flex h-full w-full max-w-md flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-md">
            <svg
              className="mb-4 h-12 w-12 text-primary-500 sm:h-16 sm:w-16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 48 48"
            >
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="#f3f4f6" />
              <path
                d="M16 28c0-4 8-4 8-8s-8-4-8-8"
                stroke="#a5b4fc"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M32 20c0 4-8 4-8 8s8 4 8 8"
                stroke="#818cf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <p className="mb-2 text-center text-lg font-semibold text-gray-700 sm:text-xl">{t("emptyTitle")}</p>
            <p className="mb-6 max-w-xs text-center text-sm text-gray-500 sm:text-base">{t("emptyDesc")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Company Profile - Only visible on small screens */}
      <div className="lg:hidden mb-6">
        <MobileCompanyProfile />
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl">
          <h2 className="mb-2 text-center text-xl font-bold sm:text-2xl">{t("title")}</h2>
          <p className="mx-auto mb-6 w-full max-w-2xl text-center text-sm text-gray-600 sm:mb-8 sm:text-base">{t("subtitle")}</p>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                title={plan.title}
                dateRange={`${format(new Date(plan.purchase_date), "dd MMMM yyyy")} – ${format(new Date(plan.expire_date), "dd MMMM yyyy")}`}
                price={`€${plan.price}`}
              // status={plan.payment_status}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousPlanCard;
