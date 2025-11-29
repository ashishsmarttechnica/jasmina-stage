import { useTranslations } from "next-intl";
import { useState } from "react";

const useProfileForm = () => {
  const [errors, setErrors] = useState({});
  const t = useTranslations("UserProfile.profile");

  const validateForm = (formData) => {
    const newErrors = {};

    // Required field validations

    // Full Name validation (Required)
    if (!formData.fullName?.trim()) {
      newErrors.fullName = t("fullNameRequired");
    }

    // Email validation (Required)
    if (!formData.email?.trim()) {
      newErrors.email = t("emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("emailInvalid");
    }

    // CV validation (Required)
    if (!formData.cv) {
      newErrors.cv = t("cvRequired");
    } else if (formData.cv) {
      const file = formData.cv;
      const validExt = [t("pdf"), t("doc"), t("docx"), t("tex"), t("webp")];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!validExt.includes(`.${fileExtension}`)) {
        newErrors.cv = t("InvalidFileFormatError");
      }
    }

    if (!formData.message?.trim()) {
      newErrors.message = "Meassage is required";
    }
    // Optional fields don't need validation:
    // - phone
    // - linkedinUrl
    // - portfolioUrl
    // - pronouns
    // - location
    // - preferredStartDate
    // - currentAvailability
    // - salaryExpectationMin
    // - salaryExpectationMax
    // - coverLetter
    // - additionalFiles

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
  };

  return { errors, setErrors, validateForm, clearFieldError };
};

export default useProfileForm;
