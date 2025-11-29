import { useTranslations } from "next-intl";
import { useState } from "react";

const useCompanyProfileForm = () => {
  const [errors, setErrors] = useState({});
  const t = useTranslations("CompanyProfile");

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = t("profile.companyNameError");
    if (!formData.firstName.trim()) newErrors.firstName = t("profile.firstNameError");
    if (!formData.lastName.trim()) newErrors.lastName = t("profile.lastNameError");
    // if (!formData.phoneNumber.trim())
    //   newErrors.phoneNumber = t("profile.phoneNumberError");
    if (!formData.country.trim()) newErrors.country = t("location.countryError");
    // if (!formData.city.trim()) newErrors.city = t("location.cityError");
    if (!formData.fullAddress.trim()) newErrors.fullAddress = t("location.fullAddressError");

    // Handle industryType as either string or array
    if (Array.isArray(formData.industryType)) {
      if (formData.industryType.length === 0) {
        newErrors.industryType = t("industry.industryTypeError");
      }
    } else if (
      !formData.industryType ||
      (typeof formData.industryType === "string" && !formData.industryType.trim())
    ) {
      newErrors.industryType = t("industry.industryTypeError");
    }

    if (!formData.website.trim()) newErrors.website = t("profile.websiteError");
    if (!formData.logoUrl?.trim()) {
      newErrors.logoUrl = t("profile.logoUrlError");
    }

    if (!formData.companyType.trim()) newErrors.companyType = t("industry.companyTypeError");
    // if (!formData.socialLinks.trim())
    //   newErrors.socialLinks = "socialLinks is required.";
    // if (!formData.tagline.trim()) newErrors.tagline = t("industry.taglineError");
    if (!formData.employees.trim()) newErrors.employees = t("industry.employeesError");
    if (!formData.description.trim()) newErrors.description = t("industry.descriptionError");

    if (formData.instagramLink?.trim() !== "") {
      try {
        const url = new URL(formData.instagramLink);
        if (!url.hostname.includes("instagram.com")) {
          newErrors.instagramLink = t("InvalidInstagramLinkError") || "Invalid Instagram Link";
        }
      } catch {
        newErrors.instagramLink = t("InvalidLinkError") || "Invalid Link";
      }
    }
    // x link validation
    if (formData.twitterLink?.trim() !== "") {
      try {
        const url = new URL(formData.twitterLink);
        if (!url.hostname.includes("x.com")) {
          newErrors.twitterLink = t("InvalidXLinkError") || "Invalid X Link";
        }
      } catch {
        newErrors.twitterLink = t("InvalidLinkError") || "Invalid Link";
      }
    }
    // facebook link validation
    if (formData.facebookLink?.trim() !== "") {
      try {
        const url = new URL(formData.facebookLink);
        if (!url.hostname.includes("facebook.com")) {
          newErrors.facebookLink = t("InvalidFacebookLinkError") || "Invalid Facebook Link";
        }
      } catch {
        newErrors.facebookLink = t("InvalidLinkError");
      }
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = t("profile.phoneNumberError");
    } else {
      const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        newErrors.phoneNumber = t("profile.PhoneLength10to15Error"); // Add this key in your translations
      }
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

export default useCompanyProfileForm;
