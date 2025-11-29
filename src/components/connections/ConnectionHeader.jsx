import { useTranslations } from "next-intl";

const ConnectionHeader = () => {
  const t = useTranslations("CompanyProfile.singleCompany");

  return (
    <div className="border-b border-black/10">
      <h2 className="px-4 py-4 text-xl font-medium sm:px-6">{t("connections")}</h2>
    </div>
  );
};

export default ConnectionHeader;
