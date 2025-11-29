"use client";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const TabsWithUnderline = ({
  activeTab,
  setActiveTab,
  peopleRef,
  companyRef,
  hoverStyle,
  underlineStyle,
  handleHover,
  handleHoverLeave,
}) => {
  const t = useTranslations("CompanyProfile.singleCompanyTab");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize positions after component mount
  useEffect(() => {
    if (!isInitialized && peopleRef?.current && companyRef?.current) {
      // Force a re-render after initial mount
      setIsInitialized(true);
      // Trigger hover on active tab to set correct position
      if (activeTab === "people") {
        handleHover(peopleRef);
      } else if (activeTab === "company") {
        handleHover(companyRef);
      }
    }
  }, [isInitialized, peopleRef, companyRef, activeTab, handleHover]);

  return (
    <div
      className="relative flex gap-0 border-b border-black/10 text-[14px] font-medium"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex w-full">
        <button
          ref={peopleRef}
          onClick={() => {
            setActiveTab("people");
            handleHover(peopleRef);
          }}
          onMouseEnter={() => handleHover(peopleRef)}
          onMouseLeave={handleHoverLeave}
          className={`px-4 py-3.5 transition-all duration-200 outline-none hover:scale-[1.02] sm:px-6 ${activeTab === "people" ? "text-primary" : "text-grayBlueText hover:text-primary/80"
            }`}
        >
          {t("people")}
        </button>

        <button
          ref={companyRef}
          onClick={() => {
            setActiveTab("company");
            handleHover(companyRef);
          }}
          onMouseEnter={() => handleHover(companyRef)}
          onMouseLeave={handleHoverLeave}
          className={`px-4 py-3.5 transition-all duration-200 outline-none hover:scale-[1.02] sm:px-6 ${activeTab === "company" ? "text-primary" : "text-grayBlueText hover:text-primary/80"
            }`}
        >
          {t("company")}
        </button>
      </div>

      {/* Hover underline */}
      <motion.div
        layout
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
        className="bg-primary/40 absolute bottom-[-2.3px] h-1 transition-all duration-300 ease-in-out"
        style={{
          width: `${hoverStyle.width}px`,
          left: `${hoverStyle.left}px`,
          opacity: hoverStyle.opacity,
        }}
      />

      {/* Active underline */}
      <motion.div
        layout
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
        className="bg-primary absolute bottom-[-2.3px] h-1 transition-all duration-300 ease-in-out"
        style={{
          width: `${underlineStyle.width}px`,
          left: `${underlineStyle.left}px`,
        }}
      />
    </div>
  );
};

export default TabsWithUnderline;
