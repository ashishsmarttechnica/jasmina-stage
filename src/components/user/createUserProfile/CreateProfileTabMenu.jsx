"use client";
import Education from "@/assets/svg/user/Education";
import Preference from "@/assets/svg/user/Preference";
import Resume from "@/assets/svg/user/Resume";
import User from "@/assets/svg/user/User";
import useUser from "@/hooks/auth/useUser";
import useAuthStore from "@/store/auth.store";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import CreateProfile from "./CreateProfile";
import EducationSkills from "./EducationSkills";
import Preferences from "./Preferences";
import ResumeUpload from "./ResumeUpload";
import WhoCanSeeYourProfile from "./WhoCanSeeYourProfile";

const VerificationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [resumeDraftFile, setResumeDraftFile] = useState(null);
  const [resumeDraftFileName, setResumeDraftFileName] = useState("");
  const t = useTranslations("UserProfile.userprofilemenu");
  const { data: userData, isLoading } = useUser();
  const { user } = useAuthStore();
  // console.log(user, "user");
  const availabilty = user?.profile?.availabilty;
  // console.log(availabilty, "availabilty");

  // console.log(user?.steps, "const");
  const steps = [
    {
      label: t("profile"),
      icon: (isActive) => <User isActive={isActive} />,
      component: <CreateProfile isLoading={isLoading} setActiveTab={setActiveTab} activeTab={activeTab} />,
    },

    availabilty !== "Not Available" &&
    availabilty !== "" && {
      label: t("preferences"),
      icon: (isActive) => <Preference isActive={isActive} />,
      component: <Preferences setActiveTab={setActiveTab} availabilty={availabilty} activeTab={activeTab} />,
    },
    {
      label: t("education"),
      icon: (isActive) => <Education isActive={isActive} />,
      component: <EducationSkills setActiveTab={setActiveTab} activeTab={activeTab} />,
    },
    {
      label: t("resume"),
      icon: (isActive) => <Resume isActive={isActive} />,
      component: (
        <ResumeUpload
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          draftFile={resumeDraftFile}
          setDraftFile={setResumeDraftFile}
          draftFileName={resumeDraftFileName}
          setDraftFileName={(name) => {
            setResumeDraftFileName(name || "");
            try {
              if (typeof window !== "undefined") {
                if (name) {
                  window.localStorage.setItem("resumeFileName", name);
                } else {
                  window.localStorage.removeItem("resumeFileName");
                }
              }
            } catch {}
          }}
        />
      ),
    },
  ].filter(Boolean);

  const handleTabClick = (index) => {
    if (index > user?.steps) return;
    setActiveTab(index);
    setIsOpen(false);
  };

  const isFinalStep = activeTab > steps.length - 1;
  const currentStepIndex = activeTab;


  useEffect(() => {
    if (user?.steps !== undefined) {
      let adjustedStep = user.steps;

      if (adjustedStep > steps.length) {
        adjustedStep = steps.length;
      }

      setActiveTab(adjustedStep);
    }
  }, [user, availabilty, steps.length]);

  // Load persisted resume filename on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("resumeFileName");
        if (stored) setResumeDraftFileName(stored);
      }
    } catch {}
  }, []);

  return (
    <div className="my-9">
      {!isFinalStep && (
        <div className="container mx-auto max-w-[1110px] px-4">
          <div className="rounded-md bg-white px-4 py-4 shadow-md md:px-10">
            <div className="flex items-center justify-between md:hidden">
              {steps.map((step, index) => {
                if (index === currentStepIndex) {
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className="text-[10px]">{step.icon(true)}</div>
                      <h2 className="text-primary text-sm font-semibold">{step.label}</h2>
                    </div>
                  );
                }
                return null;
              })}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-2xl"
                aria-label="Toggle Menu"
              >
                {isOpen ? <IoClose /> : <BiMenuAltRight />}
              </button>
            </div>

            <div className="md:hidden">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px]" : "max-h-0"
                  }`}
              >
                <ul className="flex flex-col gap-4 py-4">
                  {steps.map((item, index) => {
                    const isActive = index <= currentStepIndex;

                    return (
                      <li key={index} className="text-background flex items-center gap-3 text-sm">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${isActive ? "bg-primary" : "bg-grayBlueText"
                            }`}
                        >
                          <span className="text-xs text-white">{index + 1}</span>
                        </div>
                        <button
                          onClick={() => handleTabClick(index)}
                          disabled={index > user?.steps}
                          className={`flex w-full items-center gap-2 ${isActive ? "text-primary text-sm font-bold" : "text-background"
                            } ${index > user?.steps
                              ? "cursor-not-allowed opacity-50"
                              : "hover:text-primary"
                            }`}
                        >
                          {item.icon(isActive)}

                          <span className="block text-sm break-words whitespace-normal">
                            {item.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="hidden md:block">
              <ul className="relative flex flex-row items-center justify-between gap-6 pl-6 md:gap-2 md:pl-0">
                {steps.map((item, index) => {
                  const isActive = index <= currentStepIndex;

                  return (
                    <React.Fragment key={index}>
                      <li className="relative flex w-full items-center gap-3 md:w-auto">
                        <button
                          onClick={() => handleTabClick(index)}
                          disabled={index > user?.steps}
                          className={`flex w-full items-center gap-2 no-underline md:w-auto ${isActive ? "text-primary font-bold" : "text-background"
                            } ${index > user?.steps
                              ? "cursor-not-allowed opacity-50"
                              : "hover:text-primary"
                            }`}
                        >
                          {item.icon(isActive)}
                          <span className="block text-sm break-words whitespace-normal md:text-sm md:whitespace-nowrap xl:text-[15px]">
                            {item.label}
                          </span>
                        </button>
                      </li>

                      {index !== steps.length - 1 && (
                        <li className="bg-grayBlueText/[30%] hidden h-[1px] w-full md:block"></li>
                      )}
                    </React.Fragment>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Active Step Component */}
      <div className="relative mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {!isFinalStep
              ? steps[activeTab].component
              : (
                <WhoCanSeeYourProfile
                  onBack={() => setActiveTab(Math.max(0, steps.length - 1))}
                />
              )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerificationBar;
