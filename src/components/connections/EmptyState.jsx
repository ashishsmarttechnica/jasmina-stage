import { useTranslations } from "next-intl";

const EmptyState = ({ activeTab }) => {
  const t = useTranslations("CompanyProfile.singleCompanyTab");

  return (
    <div className="text-grayBlueText p-4 text-center sm:p-6">
      {t("No")} {activeTab}   {t("connectionfound")}
    </div>
  );
};

export default EmptyState;
