"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../store/auth.store";
import AboutTab from "./tabs/AboutTab";
import JobTab from "./tabs/JobTab";
import PostTab from "./tabs/PostTab";
// import PeopleTab from "./tabs/PeopleTab";

const SingleCompanyTab = ({ userData, isLoading }) => {
  const t = useTranslations("CompanyProfile.singleCompanyTab");
  const [isRTL, setIsRTL] = useState(false);
  const tabRefs = useRef({});
  const { user } = useAuthStore();
  const tabs = [t("about"), t("JobOpportunities"), user?.companyType === "ngo" && t("Posts")];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    // Detect RTL from document
    setIsRTL(typeof document !== "undefined" && document.documentElement.dir === "rtl");
  }, []);

  return (
    <div className="rounded-[5px] bg-white shadow">
      {/* Desktop Tabs */}
      <div
        className="relative hidden border-b border-black/10 text-[14px] font-medium text-gray-500 sm:flex"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={`flex ${isRTL ? "flex-row-reverse" : ""} gap-6`}>
          {tabs.map((tab) => (
            <button
              key={tab}
              ref={(el) => (tabRefs.current[tab] = el)}
              onClick={() => setActiveTab(tab)}
              className={`relative px-2 py-3.5 whitespace-nowrap capitalize outline-none ${
                activeTab === tab ? "text-primary" : ""
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="bg-primary absolute bottom-0 h-[3px]"
                  initial={false}
                  animate={{
                    width: tabRefs.current[tab]?.scrollWidth || "auto",
                    left: isRTL ? "unset" : 0,
                    right: isRTL ? 0 : "unset",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="p-4 sm:hidden" dir={isRTL ? "rtl" : "ltr"}>
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className={`focus:ring-primary/20 focus:border-primary w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:ring-2 focus:outline-none ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {tabs.map((tab) => (
              <option key={tab} value={tab} className="py-3">
                {tab}
              </option>
            ))}
          </select>
          <div
            className={`pointer-events-none absolute inset-y-0 ${
              isRTL ? "left-0" : "right-0"
            } flex items-center px-4`}
          >
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isRTL ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-[200px]"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {activeTab === tabs[0] && <AboutTab userData={userData} />}
          {activeTab === tabs[1] && <JobTab userData={userData} />}
       {user?.companyType === "ngo" &&  activeTab === tabs[2] && <PostTab posts={userData?.posts || []} userData={userData} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SingleCompanyTab;
