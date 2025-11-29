"use client";
import Bannerimg from "@/assets/form/Bannerimg.png";
import useUpdateCompanyProfile from "@/hooks/company/useUpdateCompanyProfile";
import useCompanyProfileForm from "@/hooks/validation/company/useCompanyProfileForm";
import { useRouter } from "@/i18n/navigation";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Loader } from "rsuite";
import TermsCheckbox from "../auth/TermsCheckbox";
import CompanyBasicInfo from "./companyUpdateForm/CompanyBasicInfo";
import CompanyLocationForm from "./companyUpdateForm/CompanyLocationForm";
import CompanyMediaForm from "./companyUpdateForm/CompanyMediaForm";
import CompanySizeForm from "./companyUpdateForm/CompanySizeForm";
import LGBTQCheckbox from "./LGBTQCheckbox";

const CreateCompany = () => {
  const t = useTranslations("CompanyProfile.industry");
  const { mutate: updateProfile, isPending, error } = useUpdateCompanyProfile();
  const router = useRouter();



  const [selectedBannerimgImage, setSelectedBannerimgImage] = useState(Bannerimg);
  const [selectedCompanyImageFile, setSelectedCompanyImageFile] = useState(null);
  const [selectedBannerImageFile, setSelectedBannerImageFile] = useState(null);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isLGBTQChecked, setIsLGBTQChecked] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [lgbtqError, setLgbtqError] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    contact: "",
    website: "",
    country: "",
    city: "",
    location: "",
    fullAddress: "",
    industryType: [],
    companyType: "",
    employees: "",
    tagline: "",
    description: "",
    socialLinks: "",
    instagramLink: "",
    twitterLink: "",
    facebookLink: "",
    isLGBTQ: false,
  });

  const { errors, setErrors, validateForm, clearFieldError } = useCompanyProfileForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (Array.isArray(value)) {
      if (value.length > 0) {
        clearFieldError(name);
      }
    } else if (typeof value === "string" && value.trim() !== "") {
      clearFieldError(name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!validateForm(formData)) return;
    if (!isTermsChecked) {
      setTermsError(t("checkSingUp"));
      hasError = true;
    } else {
      setTermsError("");
    }
    if (formData.isLGBTQ && !isLGBTQChecked) {
      setLgbtqError("Please confirm your company's LGBTQ+ commitment to proceed.");
      hasError = true;
    } else {
      setLgbtqError("");
    }

    if (hasError) return;

    const submitData = new FormData();

    submitData.append("companyName", formData.companyName);
    submitData.append("firstName", formData.firstName);
    submitData.append("lastName", formData.lastName);
    submitData.append("phoneNumber", formData.phoneNumber);
    submitData.append("country", formData.country);
    if (formData.countryCode) {
      submitData.append("countryCode", formData.countryCode);
    }
    submitData.append("city", formData.city);
    submitData.append("fullAddress", formData.fullAddress);

    if (Array.isArray(formData.industryType)) {
      formData.industryType.forEach((value, index) => {
        submitData.append(`industryType[${index}]`, value);
      });
    } else {
      submitData.append("industryType", formData.industryType);
    }
    // console.log(formData.isLGBTQ, "formData.isLGBTQ");
    submitData.append("companyType", formData.companyType);
    submitData.append("numberOfEmployees", formData.employees);
    submitData.append("tagline", formData.tagline);
    submitData.append("isLGBTQFriendly", formData.isLGBTQ);

    if (typeof formData.contact === "string" && formData.contact.trim() !== "") {
      submitData.append("contact", formData.contact);
    }

    if (typeof formData.website === "string" && formData.website.trim() !== "") {
      submitData.append("website", formData.website);
    }
    if (typeof formData.description === "string" && formData.description.trim() !== "") {
      submitData.append("description", formData.description);
    }

    // if (typeof formData.socialLinks === "string" && formData.socialLinks.trim() !== "") {
    // }

    submitData.append("socialLinks", formData.socialLinks);
    submitData.append("instagram", formData.instagramLink);
    submitData.append("x", formData.twitterLink);
    submitData.append("facebook", formData.facebookLink);

    if (selectedCompanyImageFile instanceof File) {
      submitData.append("logoUrl", selectedCompanyImageFile);
    }

    if (selectedBannerImageFile instanceof File) {
      submitData.append("coverBannerUrl", selectedBannerImageFile);
    }
    submitData.append("profileComplete", true);

    updateProfile(submitData, {
      onSuccess: (res) => {
        if (res.success) {
          Cookies.set("profileCreated", true);
          router.push("/feed");
        }
      },
    });
  };

  return (
    <form className="mt-5 space-y-2" onSubmit={handleSubmit}>
      <CompanyBasicInfo
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        setSelectedCompanyImageFile={setSelectedCompanyImageFile}
      />

      <CompanyLocationForm
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        setFormData={setFormData}
        clearFieldError={clearFieldError}
      />

      <CompanySizeForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        clearFieldError={clearFieldError}
        handleChange={handleChange}
      />

      <CompanyMediaForm
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        selectedImage={selectedBannerimgImage}
        setSelectedImage={setSelectedBannerimgImage}
        setSelectedBannerImageFile={setSelectedBannerImageFile}
      />
      <TermsCheckbox
        isChecked={isTermsChecked}
        setIsChecked={(checked) => {
          setIsTermsChecked(checked);
          if (checked) setTermsError("");
        }}
        error={termsError}
      />
      {/* LGBTQ Checkbox Section */}
      <LGBTQCheckbox
        show={formData.country && formData.isLGBTQ === true}
        isChecked={isLGBTQChecked}
        setIsChecked={(checked) => {
          setIsLGBTQChecked(checked);
          if (checked) setLgbtqError("");
        }}
        lgbtqError={lgbtqError}
      />

      <div className="grid grid-cols-1 gap-2">
        <div className="block space-y-4">
          <button className="btn-fill">
            {" "}
            {isPending ? (
              <div>
                <Loader inverse />
              </div>
            ) : (
              `${t("Next")} `
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateCompany;

