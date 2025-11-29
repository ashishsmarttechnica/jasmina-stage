import { useTranslations } from "next-intl";
import { useState } from "react";

const useRequirementsValidation = () => {
  const [errors, setErrors] = useState({});
  const t = useTranslations("CreateJobForm");

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.description?.trim()) {
      newErrors.description = t("requirementsStep.descriptionRequired");
    }

    // Not validating seniorityLevel since it has a default value

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
    clearError
  };
};

export default useRequirementsValidation;