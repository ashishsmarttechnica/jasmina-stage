import { useTranslations } from "next-intl";
import { useState } from "react";

const useJobDetailsValidation = () => {
  const [errors, setErrors] = useState({});
  const t = useTranslations("CreateJobForm");

  const validateForm = (formData, locationComplete) => {
    const newErrors = {};

    // Required fields validation
    if (!formData.jobTitle?.trim()) {
      newErrors.jobTitle = t("detailsStep.jobTitleRequired");
    } else if (formData.jobTitle.trim().length > 75) {
      newErrors.jobTitle = t("detailsStep.jobTitleMaxss");
    }

    if (!formData.jobType?.trim()) {
      newErrors.jobType = t("detailsStep.jobTypeRequired");
    }

    if (!formData.department?.trim()) {
      newErrors.department = t("detailsStep.departmentRequired");
    }

    // Location validation (only if not remote)
    if (!formData.isRemote) {
      if (!formData.jobLocation?.trim()) {
        newErrors.jobLocation = t("detailsStep.jobLocationRequired");
      } else if (!locationComplete) {
        newErrors.jobLocation = t("detailsStep.jobLocationIncomplete");
      }
    }

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

  const clearLocationErrors = () => {
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors.jobLocation;
      delete updatedErrors.jobArea;
      return updatedErrors;
    });
  };

  return {
    errors,
    setErrors,
    validateForm,
    clearError,
    clearLocationErrors,
  };
};

export default useJobDetailsValidation;
