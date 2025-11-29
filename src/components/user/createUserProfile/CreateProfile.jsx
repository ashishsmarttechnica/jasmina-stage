import Uploadimg from "@/assets/form/Uploadimg.png";
import CustomDatePicker from "@/common/DatePicker";
import ImageUploader from "@/common/ImageUploader";
import InputField from "@/common/InputField";
import Selecter from "@/common/Selecter";
import SimpleLocationSelector from "@/common/SimpleLocationSelector";
import ReusableForm from "@/components/form/ReusableForm";
import useUpdateProfile from "@/hooks/user/useUpdateProfile";
import useProfileForm from "@/hooks/validation/user/useProfileForm";
import getImg from "@/lib/getImg";
import useAuthStore from "@/store/auth.store";
import useLocationStore from "@/store/location.store";
import { useAvailabilityOptions, useGenderOptions, usePronounOptions } from "@/utils/selectOptions";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Loader } from "rsuite";

const CreateProfile = ({ isLoading, setActiveTab, activeTab }) => {
  const { user, setUser } = useAuthStore();
  const { resetLocation } = useLocationStore();
  const t = useTranslations("UserProfile.profile");
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();

  const [selectedImage, setSelectedImage] = useState(Uploadimg);
  const [selectedUserImageFile, setSelectedUserImageFile] = useState(null);
  const { errors, setErrors, validateForm, clearFieldError } = useProfileForm();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "",
    pronoun: "",
    availabilty: "",
    dob: "",
    phone: "",
    location: "",
    LinkedInLink: "",
    instagramLink: "",
    xLink: "",
    facebookLink: "",
    short_bio: "",
    isPrivate: false,
  });

  // gender options
  const genderOptions = useGenderOptions();
  // pronoun options
  const pronounOptions = usePronounOptions();

  // availabilty options
  const availabilityOptions = useAvailabilityOptions();

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (value.trim() !== "") {
        clearFieldError(name);
      }
    },
    [clearFieldError]
  );

  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handlePhoneChange = useCallback(
    (e) => {
      const { value } = e.target;
      const formattedValue = value.replace(/[^\d\s+\-()]/g, "");
      setFormData((prev) => ({ ...prev, phone: formattedValue }));
      if (formattedValue.trim() !== "") {
        clearFieldError("phone");
      }
    },
    [clearFieldError]
  );

  const handleLinkedInChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prev) => ({ ...prev, LinkedInLink: value }));
      if (value.trim() !== "") {
        clearFieldError("LinkedInLink");
      }
    },
    [clearFieldError]
  );

  const handleLinkChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value.trim() !== "") {
        clearFieldError(name);
      }
    },
    [clearFieldError]
  );

  const handleDateChange = useCallback(
    (date) => {
      setFormData((prev) => ({ ...prev, dob: date }));
      clearFieldError("dob");
    },
    [clearFieldError]
  );

  const handleLocationChange = useCallback(
    (val) => {
      if (val) {
        setFormData((prev) => ({ ...prev, location: val }));
        clearFieldError("location");
      }
    },
    [clearFieldError]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData)) return;

    const submitData = new FormData();
    submitData.append("profile.fullName", formData.name);
    submitData.append("profile.userName", formData.username);
    submitData.append("profile.gender", formData.gender);
    submitData.append("profile.pronounce", formData.pronoun);
    submitData.append("profile.dob", formData.dob);
    submitData.append("profile.phone", formData.phone);
    submitData.append("profile.location", formData.location);
    submitData.append("profile.isPrivate", formData.isPrivate);

    if (formData.LinkedInLink.trim() !== "") {
      submitData.append("profile.linkedin", formData.LinkedInLink);
    }
    if (formData.instagramLink.trim() !== "") {
      submitData.append("profile.instagram", formData.instagramLink);
    }
    if (formData.xLink.trim() !== "") {
      submitData.append("profile.x", formData.xLink);
    }
    if (formData.facebookLink.trim() !== "") {
      submitData.append("profile.facebook", formData.facebookLink);
    }

    submitData.append("profile.availabilty", formData.availabilty);
    if (selectedUserImageFile instanceof File && selectedImage !== Uploadimg) {
      submitData.append("profile.photo", selectedUserImageFile);
    }
    submitData.append("profile.short_bio", formData.short_bio);
    submitData.append("steps", activeTab + 1);
    updateProfile(submitData, {
      onSuccess: (res) => {
        if (res.success) {
          setActiveTab(activeTab + 1);
        }
      },
    });
  };

  // Update form data when user data is loaded
  useEffect(() => {
    if (user?.profile) {
      setFormData((prev) => ({
        ...prev,
        name: user.profile.fullName || "",
        username: user.profile.userName || "",
        gender: user.profile.gender || "",
        pronoun: user.profile.pronounce || "",
        availabilty: user.profile.availabilty || "",
        dob: user.profile.dob || "",
        phone: user.profile.phone || "",
        location: user.profile.location || "",
        LinkedInLink: user.profile.linkedin || "",
        instagramLink: user.profile.instagram || "",
        xLink: user.profile.x || "",
        facebookLink: user.profile.facebook || "",
        short_bio: user.profile.short_bio || "",
        isPrivate: user.profile.isPrivate || false,
      }));

      setSelectedImage(getImg(user.profile.photo) || Uploadimg);
    }

    // Reset location selections when component unmounts
    return () => {
      resetLocation();
    };
  }, [user, resetLocation]);

  return (
    <>
      <ReusableForm title={t("title")} maxWidth="max-w-[698px] lg:max-w-[800px] xl:max-w-[900px]" subtitle={t("subTitle")}>
        <form className="mt-3 sm:mt-5 space-y-3 sm:space-y-4 px-2 sm:px-0" onSubmit={handleSubmit}>
          {/* Image Uploader - Full width on mobile, centered on larger screens */}
          <div className="flex justify-center sm:justify-start">
            <ImageUploader
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              setSelectedImageFile={setSelectedUserImageFile}
              priority={true}
              enableCropping={true}
              aspectRatio={1}
              isRounded={true}
            />
          </div>

          {/* Main Form Grid - Responsive layout */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
            {/* First Row - Name and Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label={`${t("name")}*`}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("namePlaceholder")}
                error={errors.name}
              />

              <InputField
                label={`${t("username")}*`}
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={t("usernamePlaceholder")}
                error={errors.username}
              />
            </div>

            {/* Second Row - Gender and Pronoun */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Selecter
                name="gender"
                label={`${t("gender")} `}
                placeholder={t("genderPlaceholder")}
                value={formData.gender}
                onChange={handleChange}
                options={genderOptions}
                isOther={true}
              />

              <Selecter
                name="pronoun"
                label={`${t("pronoun")}`}
                placeholder={t("pronounPlaceholder")}
                value={formData.pronoun}
                onChange={handleChange}
                options={pronounOptions}
                isOther={true}
              />
            </div>

            {/* Privacy Checkbox - Full width */}
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleCheckboxChange}
                  className="text-primary focus:ring-primary border-primary accent-primary h-4 w-4 cursor-pointer rounded"
                />
              </div>
              <label
                className="hover:text-primary cursor-pointer font-medium transition-colors select-none"
                htmlFor="isPrivate"
              >
                {t("isPrivate")}
              </label>
            </div>

            {/* Third Row - DOB and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <CustomDatePicker
                value={formData.dob}
                onChange={handleDateChange}
                error={errors.dob}
                label={`${t("dob")}*`}
                maxDate={new Date()}
              />

              <InputField
                label={`${t("phone")} `}
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder={t("phonePlaceholder")}
                type="tel"
              />
            </div>

            {/* Social Media Links - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <InputField
                label={`${t("LinkedInLink")} `}
                name="LinkedInLink"
                value={formData.LinkedInLink}
                onChange={handleLinkedInChange}
                placeholder={t("LinkedInLinkPlaceholder") || "Enter your LinkedIn Link"}
                className="sm:col-span-1 lg:col-span-1"
              />

              <InputField
                label={`${t("instagramLink") || "Instagram Link"} `}
                name="instagramLink"
                value={formData.instagramLink}
                onChange={handleLinkChange}
                placeholder={t("instagramLinkPlaceholder") || "Enter your Instagram Link"}
                className="sm:col-span-1 lg:col-span-1"
              />

              <InputField
                label={`${t("xLink") || "X Link"} `}
                name="xLink"
                value={formData.xLink}
                onChange={handleLinkChange}
                placeholder={t("xLinkPlaceholder") || "Enter your X Link"}
                className="sm:col-span-1 lg:col-span-1"
              />

              <InputField
                label={`${t("facebookLink") || "Facebook Link"} `}
                name="facebookLink"
                value={formData.facebookLink}
                onChange={handleLinkChange}
                placeholder={t("facebookLinkPlaceholder") || "Enter your Facebook Link"}
                className="sm:col-span-1 lg:col-span-1"
              />
            </div>

            {/* Availability - Full width on mobile, half width on larger screens */}
            <div className="w-full sm:w-1/2">
              <Selecter
                name="availabilty"
                label={`${t("availability")} `}
                placeholder={t("availabilityPlaceholder") || "Select your availabilty"}
                value={formData.availabilty}
                onChange={handleChange}
                options={availabilityOptions}
                error={errors.availabilty}
                isClearable={true}
              />
            </div>

            {/* Short Bio - Full width */}
            <InputField
              label={`${t("short_bio")}`}
              name="short_bio"
              value={formData.short_bio}
              onChange={handleChange}
              placeholder={t("short_bioPlaceholder") || "Enter your short bio"}
            />

            {/* Location Selector - Full width */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {`${t("location")}*`}
              </label>
              <SimpleLocationSelector
                value={formData.location}
                onChange={handleLocationChange}
                error={errors.location}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 sm:mt-8">
            <div className="grid grid-cols-2 gap-4">
              {activeTab > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                  disabled={isPending}
                  className="btn-white-fill"
                >
                  {t("Back")} <span className="text-[20px]">&lt;</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isPending}
                className={`btn-fill hover:bg-opacity-90 w-full py-3 sm:py-4 text-base sm:text-lg font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 rounded-lg ${activeTab > 0 ? "" : "col-span-2"}`}
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <Loader inverse size="sm" />
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  `${t("Next")} >`
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-center text-sm sm:text-base text-red-500 px-2">
              {error?.response?.data?.message || `${t("SomethingWentWrong")}`}
            </p>
          )}
        </form>
      </ReusableForm>
    </>
  );
};

export default CreateProfile;
