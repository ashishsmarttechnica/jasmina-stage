import { useTranslations } from "next-intl";
import { useState } from "react";

const useProfileForm = () => {
  const [errors, setErrors] = useState({});
  const t = useTranslations("UserProfile.profile");

  const validateForm = (formData) => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = t("NameError");
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = t("UsernameError");
    }

    // Gender validation
    // if (!formData.gender) {
    //   newErrors.gender = t("GenderError");
    // }

    // Date of Birth validation
    if (!formData.dob) {
      newErrors.dob = t("DobError");
    }

    // Phone validation
    // if (!formData.phone) {
    //   newErrors.phone = t("PhoneError");
    // } else {
    //   const phoneDigits = formData.phone.replace(/\D/g, "");
    //   if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    //     newErrors.phone = t("PhoneLength10to15Error"); // Add this key in your translations
    //   }
    // }

    // Location validation
    if (!formData.location) {
      newErrors.location = t("LocationError");
    } else {
      const locationParts = formData.location.split(", ");
      // Only require country (last part)
      const country = locationParts[locationParts.length - 1];
      if (!country) {
        newErrors.location = t("LocationError");
      }
    }

    // if (!formData.LinkedInLink) {
    //   newErrors.LinkedInLink = t("LinkedInLinkError");
    // }
    // LinkedIn URL validation
    // if (formData.LinkedInLink?.trim()) {
    //   try {
    //     const url = new URL(formData.LinkedInLink);
    //     if (!url.hostname.includes("linkedin.com")) {
    //       newErrors.LinkedInLink = t("InvalidLinkedInLinkError");
    //     }
    //   } catch {
    //     newErrors.LinkedInLink = t("InvalidLinkError");
    //   }
    // }
    // instagram link validation
    // if (formData.instagramLink?.trim() !== "") {
    //   try {
    //     const url = new URL(formData.instagramLink);
    //     if (!url.hostname.includes("instagram.com")) {
    //       newErrors.instagramLink = t("InvalidInstagramLinkError") || "Invalid Instagram Link";
    //     }
    //   } catch {
    //     newErrors.instagramLink = t("InvalidLinkError");
    //   }
    // }
    // x link validation
    // if (formData.xLink?.trim() !== "") {
    //   try {
    //     const url = new URL(formData.xLink);
    //     if (!url.hostname.includes("x.com")) {
    //       newErrors.xLink = t("InvalidXLinkError") || "Invalid X Link";
    //     }
    //   } catch {
    //     newErrors.xLink = t("InvalidLinkError") || "Invalid Link";
    //   }
    // }
    // facebook link validation
    // if (formData.facebookLink?.trim() !== "") {
    //   try {
    //     const url = new URL(formData.facebookLink);
    //     if (!url.hostname.includes("facebook.com")) {
    //       newErrors.facebookLink = t("InvalidFacebookLinkError") || "Invalid Facebook Link";
    //     }
    //   } catch {
    //     newErrors.facebookLink = t("InvalidLinkError");
    //   }
    // }

    // short bio validation
    // if (formData.short_bio?.trim() !== "") {
    //   if (formData.short_bio.length > 100) {
    //     newErrors.short_bio = t("ShortBioLengthError") || "Short bio must be less than 100 characters";
    //   }
    // }

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

export default useProfileForm;
