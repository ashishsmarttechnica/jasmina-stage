"use client";
import Bannerimg from "@/assets/form/Bannerimg.png";
import CompanyBasicInfo from "@/components/company/companyUpdateForm/CompanyBasicInfo";
import CompanyLocationForm from "@/components/company/companyUpdateForm/CompanyLocationForm";
import CompanyMediaForm from "@/components/company/companyUpdateForm/CompanyMediaForm";
import EditCompanySizeForm from "@/components/company/companyUpdateForm/EditCompanySizeForm";
import useUpdateCompanyProfile from "@/hooks/company/useUpdateCompanyProfile";
import useCompanyProfileForm from "@/hooks/validation/company/useCompanyProfileForm";
import { useRouter } from "@/i18n/navigation";
import getImg from "@/lib/getImg";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Loader } from "rsuite";

const EditCompany = ({ userData, onClose }) => {
  const t = useTranslations("CompanyProfile.media");
  const { mutate: updateProfile, isPending, error } = useUpdateCompanyProfile();
  const router = useRouter();

  const [selectedBannerimgImage, setSelectedBannerimgImage] = useState(Bannerimg);
  const [selectedCompanyImageFile, setSelectedCompanyImageFile] = useState(null);
  const [selectedBannerImageFile, setSelectedBannerImageFile] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    contact: "",
    website: "",
    country: "",
    countryCode: "",
    city: "",
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
    logoUrl: "",
    coverBannerUrl: "",
    isLGBTQ: false,
  });

  const { errors, setErrors, validateForm, clearFieldError } = useCompanyProfileForm();

  useEffect(() => {
    if (userData) {
      setFormData({
        companyName: userData.companyName || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        contact: userData.contact || "",
        website: userData.website || "",
        country: userData.country || "",
        countryCode: userData.countryCode || "",
        city: userData.city || "",
        fullAddress: userData.fullAddress || "",
        industryType: userData.industryType || [],
        companyType: userData.companyType || "",
        employees: userData.numberOfEmployees || "",
        tagline: userData.tagline || "",
        description: userData.description || "",
        socialLinks: userData.socialLinks || "",
        logoUrl: userData.logoUrl || "",
        coverBannerUrl: userData.coverBannerUrl || "",
        isLGBTQ: userData.isLGBTQ || false,
        instagramLink: userData.instagram || "",
        twitterLink: userData.x || "",
        facebookLink: userData.facebook || "",
      });
      if (userData.coverBannerUrl) {
        setSelectedBannerimgImage(getImg(userData.coverBannerUrl));
        setSelectedBannerImageFile(null);
      } else {
        setSelectedBannerimgImage(Bannerimg);
      }
    }
  }, [userData]);

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
    if (!validateForm(formData)) return;

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
    formData.industryType.forEach((value, index) => {
      submitData.append(`industryType[${index}]`, value);
    });
    submitData.append("companyType", formData.companyType);
    submitData.append("numberOfEmployees", formData.employees);
    submitData.append("tagline", formData.tagline);
    submitData.append("isLGBTQFriendly", formData.isLGBTQ);
    if (formData.contact.trim() !== "") {
      submitData.append("contact", formData.contact);
    }
    if (formData.website.trim() !== "") {
      submitData.append("website", formData.website);
    }
    if (formData.description.trim() !== "") {
      submitData.append("description", formData.description);
    }

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
      onSuccess: () => {
        onClose();
        window.location.reload();
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

      <EditCompanySizeForm formData={formData} errors={errors} handleChange={handleChange} />

      <CompanyMediaForm
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        selectedImage={selectedBannerimgImage}
        setSelectedImage={setSelectedBannerimgImage}
        setSelectedBannerImageFile={setSelectedBannerImageFile}
      />

      <div className="grid grid-cols-1 gap-2">
        <div className="block space-y-4">
          <button className="btn-fill max-w-40">
            {" "}
            {isPending ? (
              <div>
                <Loader inverse />
              </div>
            ) : (
              t("update")
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditCompany;
