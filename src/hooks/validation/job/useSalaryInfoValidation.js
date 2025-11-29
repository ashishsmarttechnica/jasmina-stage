import { useTranslations } from "next-intl";
import { useState } from "react";

const useSalaryInfoValidation = () => {
  const [errors, setErrors] = useState({});
  const t = useTranslations("CreateJobForm");

  const validateForm = (formData) => {
    const newErrors = {};

    // Work Mode validation (mandatory) - only if not remote
    if (!formData.isRemote && !formData.workMode) {
      newErrors.workMode = t("salaryStep.workModeRequired");
    }

    // Contact Email validation (mandatory)
    // if (!formData.contactEmail) {
    //   newErrors.contactEmail = "Contact email is required";
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
    //   newErrors.contactEmail = "Please enter a valid email address";
    // }

    if (!formData.contactNumber) {
      newErrors.contactNumber = t("salaryStep.contactNumberRequired");
    } else if (!/^\d{10,15}$/.test(formData.contactNumber.replace(/[+\s-]/g, ""))) {
      newErrors.contactNumber = t("salaryStep.contactNumberInvalid");
    }

    // Salary validation (mandatory)
    if (!formData.salaryRange) {
      newErrors.salaryRange = t("salaryStep.salaryRangeRequired");
    } else if (!formData.salaryRange) {
      // Check if the salary format is correct based on the pattern
      const isRangeFormat = /^\d+\s*-\s*\d+\s+[A-Za-z]+$/.test(formData.salaryRange); // e.g., 5000 - 8000 INR
      const isLpaFormat = /^\d+\s*-\s*\d+\s+LPA$/i.test(formData.salaryRange); // e.g., 5-7 LPA

      if (!isRangeFormat && !isLpaFormat) {
        newErrors.salaryRange = t("salaryStep.salaryRangeInvalids");
      }
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = t("salaryStep.applicationDeadlineRequired");
    } else {
      const deadlineDate = new Date(formData.applicationDeadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.applicationDeadline = t("salaryStep.applicationDeadlinePast");
      }
    }

    // Optional fields - no validation required
    // - education
    // - experience
    // - openPositions
    // - languages
    // - tags

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName) => {
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  };

  return {
    errors,
    setErrors,
    validateForm,
    clearError,
  };
};

export default useSalaryInfoValidation;
