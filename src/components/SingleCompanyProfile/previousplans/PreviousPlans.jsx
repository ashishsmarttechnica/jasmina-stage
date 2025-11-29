import MobileCompanyProfile from "@/common/MobileCompanyProfile";
import { useTranslations } from "next-intl";

const PreviousPlans = () => {
  const t = useTranslations("PreviousPlans");
  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      {/* Mobile Company Profile - Only visible on small screens */}
      <div className="lg:hidden mb-6">
        <MobileCompanyProfile />
      </div>
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-center text-base text-gray-600 sm:text-lg">
          {t("subtitle")}
        </p>
      </div>
    </div>
  );
};

export default PreviousPlans;
