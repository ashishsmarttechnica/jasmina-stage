import { useTranslations } from "next-intl";

const FilterTabs = ({ activeTab, setActiveTab }) => {
  const t = useTranslations("Applications");
  const tabs = [
    { id: "all", label: t("tabs.all") },
    { id: "0", label: t("tabs.new") },
    { id: "1", label: t("tabs.reviewed") },
    { id: "2", label: t("tabs.interviewed") },
    { id: "3", label: t("tabs.approved") },
    { id: "4", label: t("tabs.rejected") },
    { id: "5", label: t("tabs.hired") },
  ];

  return (
    <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto pb-2 sm:gap-3 md:gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`whitespace-nowrap rounded-md bg-[#F2F2F2] px-2 py-1.5 text-[11px] font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-200 sm:px-3 sm:py-2 sm:text-[13px] md:px-4 ${activeTab === tab.id ? "bg-primary text-white hover:bg-primary/90" : ""
            }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
