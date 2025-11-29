import { useTranslations } from "next-intl";
import { useState } from "react";

const useSingInValidationForm = () => {
  const t = useTranslations("auth")
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = t("EmailError");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("InvalidformatError");
    }

    if (!formData.password) {
      newErrors.password = t("PasswordError");
    } else if (formData.password.length < 6) {
      newErrors.password = t("PasswordLengthError");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName) => {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  };

  return { errors, setErrors, validateForm, clearFieldError };
};

export default useSingInValidationForm;