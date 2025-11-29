"use client";
import { useCreateJob } from "@/hooks/job/useCreateJob";
import capitalize from "@/lib/capitalize";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddJobDetails from "./steps/AddJobDetails";
import AddSkillsTab from "./steps/AddSkillsTab";
import HowToApply from "./steps/HowToApply";
import PostNewJob from "./steps/PostNewJob";
import SalaryAndInfo from "./steps/SalaryAndInfo";
// Import your icons here
// Example: import JobDetails from "@/assets/svg/job/JobDetails";

// Initial form state
const initialFormState = {
  jobTitle: "",
  jobType: "",
  department: "",
  jobLocation: "",
  jobArea: "",
  isRemote: true,
  description: "",
  seniorityLevel: "mid-level",
  responsibilities: "",
  skills: [],
  salaryRange: "",
  workHoursFrom: "",
  workHoursTo: "",
  applicationDeadline: "",
  genderPreference: "",
  education: "",
  experience: "",
  numOfEmployee: "",
  email: "",
  careerWebsite: "",
  contactNumber: "",
  contactEmail: "",
  workMode: "",
  negotiable: false,
  requiredLanguages: [],
  jobTags: [],
  applyVia: "",
};

// Storage keys
const STORAGE_KEYS = {
  formData: "createJobFormData",
  activeTab: "createJobActiveTab",
};

const CreateJobTabMenu = () => {
  const [activeTab, setActiveTab] = useState(0);
  const t = useTranslations("CreateJob");
  const { mutate: createJob, isPending } = useCreateJob();

  // Centralized form state
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a generic debounced save function
  const createDebouncedSave = useCallback((key) => {
    let timeoutId = null;
    return (data) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        localStorage.setItem(
          key,
          typeof data === "object" ? JSON.stringify(data) : data.toString()
        );
      }, 500);
    };
  }, []);

  // Create specific debounced save functions
  const debouncedSaveFormData = useCallback(createDebouncedSave(STORAGE_KEYS.formData), [
    createDebouncedSave,
  ]);
  const debouncedSaveActiveTab = useCallback(createDebouncedSave(STORAGE_KEYS.activeTab), [
    createDebouncedSave,
  ]);

  // Load data from local storage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(STORAGE_KEYS.formData);
    const savedActiveTab = localStorage.getItem(STORAGE_KEYS.activeTab);

    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (e) {
        console.error("Error parsing stored form data:", e);
      }
    }

    if (savedActiveTab) {
      setActiveTab(parseInt(savedActiveTab, 10));
    }
  }, []);

  // Save data to local storage whenever formData changes (debounced)
  useEffect(() => {
    debouncedSaveFormData(formData);
  }, [formData, debouncedSaveFormData]);

  // Save activeTab to local storage whenever it changes (debounced)
  useEffect(() => {
    debouncedSaveActiveTab(activeTab);
  }, [activeTab, debouncedSaveActiveTab]);

  // Handle form field changes
  const handleFormChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Handle final form submission
  const handleSubmit = () => {
    setIsSubmitting(true);

    try {
      // Format the data for API submission
      const jobData = {
        companyId: capitalize(Cookies.get("userId")),
        jobTitle: formData.jobTitle,
        employeeType: formData.jobType,
        department: formData.department,
        jobLocation: formData.isRemote ? "Remote" : formData.jobLocation,
        education: formData.education,
        area: formData.jobArea,
        description: formData.description,
        seniorityLevel: formData.seniorityLevel,
        salaryRange: formData.salaryRange,
        workHours: `${formData.workHoursFrom} - ${formData.workHoursTo}`,
        deadline: formData.applicationDeadline,
        experience: formData.experience,
        numOfEmployee: formData.numOfEmployee,
        requiredSkills: formData.skills,
        responsibilities: formData.responsibilities,
        genderPrefereance: formData.genderPreference,
        applyVia: formData.applyVia,
        careerWebsite: formData.careerWebsite,
        contactNumber: formData.contactNumber,
        // contactEmail: formData.contactEmail,
        ...(!formData.isRemote && { workMode: formData.workMode }),
        negotiable: formData.negotiable,
        requiredLanguages: formData.requiredLanguages,
        jobTags: formData.jobTags,
      };

      // Submit the job data
      createJob(jobData, {
        onSuccess: () => {
          // Clear localStorage after successful submission
          Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
          // Reset form
          setFormData(initialFormState);
          setActiveTab(0);
          setIsSubmitting(false);
          toast.success(t("jobPostedSuccessfully"));
        },
        onError: () => {
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error(t("errorsubmitting"), error);
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      label: t("jobDetails"),
      component: (
        <AddJobDetails
          formData={formData}
          onChange={handleFormChange}
          onNext={() => setActiveTab(1)}
        />
      ),
    },
    {
      label: t("requirements"),
      component: (
        <HowToApply
          formData={formData}
          onChange={handleFormChange}
          onNext={() => setActiveTab(2)}
          onBack={() => setActiveTab(0)}
        />
      ),
    },
    {
      label: t("skills"),
      component: (
        <AddSkillsTab
          formData={formData}
          onChange={handleFormChange}
          onNext={() => setActiveTab(3)}
          onBack={() => setActiveTab(1)}
        />
      ),
    },
    {
      label: t("salary"),
      component: (
        <SalaryAndInfo
          formData={formData}
          onChange={handleFormChange}
          onNext={() => setActiveTab(4)}
          onBack={() => setActiveTab(2)}
        />
      ),
    },
    {
      label: t("preview"),
      component: (
        <PostNewJob
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onBack={() => setActiveTab(3)}
          isSubmitting={isSubmitting}
        />
      ),
    },
  ];

  return (
    <div className="my-9">
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
            {steps[activeTab].component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateJobTabMenu;
