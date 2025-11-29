import { useTranslations } from "next-intl";
import { useState } from "react";

const usePreferencesForm = () => {
  const [errors, setErrors] = useState({});
  const t = useTranslations("UserProfile.preferences");

  // Update: accept availabilty as a second argument
  const validateForm = (formData, availabilty) => {
    const newErrors = {};
    if (!formData.role) {
      newErrors.role = t("RoleError");
    }
    // if (!formData.jobType) {
    //   newErrors.jobType = "jobType is required.";
    // }

    // Only require salaryRange if availabilty is 'Open to Work' or 'Available for Freelance'
    if (["Open to Work", "Available for Freelance", " "].includes(availabilty)) {
      if (!formData.salaryRange) {
        newErrors.salaryRange = t("SalaryRangeError");
      }
    }
    // else if (isNaN(formData.salaryRange) || formData.salaryRange <= 0) {
    //   newErrors.salaryRange = t("InvalidSalaryRangeError");
    // }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time to 00:00 for accurate comparison

    if (!formData.joindate) {
      newErrors.joindate = t("JoinDateError");
    } else {
      const joinDate = new Date(formData.joindate);
      if (joinDate < today) {
        newErrors.joindate = t("JoinDateFutureError"); // Add this key to translations
      }
    }

    if (!formData.jobType) {
      newErrors.jobType = t("JobTypeError");
    }

    if (!formData.workLocation) {
      newErrors.workLocation = t("WorkLocationError");
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

export default usePreferencesForm;
