import { useState } from "react";

const useJobApplicationValidation = () => {
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const newErrors = {};

    // Check if at least one contact method is provided
    // if (!formData.applyVia?.trim() && !formData.applyVia?.trim()) {
    //   newErrors.applyVia = "Either email or career website is required";
    //   newErrors.applyVia = "Either email or career website is required";
    // } else {
    //   // Validate email format if provided
    //   if (formData.applyVia?.trim() && !/\S+@\S+\.\S+/.test(formData.applyVia)) {
    //     newErrors.applyVia = "Please enter a valid email address";
    //   }

    //   // Validate website URL if provided
    // }

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

export default useJobApplicationValidation;
