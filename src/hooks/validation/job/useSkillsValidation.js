import { useTranslations } from "next-intl";
import { useState } from "react";

const useSkillsValidation = () => {
  const [errors, setErrors] = useState({});
  const t = useTranslations("CreateJobForm");

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.responsibilities?.trim()) {
      newErrors.responsibilities = t("skillsStep.responsibilitiesRequired");
    }

    if (formData.skills?.length === 0) {
      newErrors.skills = t("skillsStep.skillsRequired");
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

  return {
    errors,
    setErrors,
    validateForm,
    clearError,
  };
};

export default useSkillsValidation;
