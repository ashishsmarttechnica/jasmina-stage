"use client";
import { applyJob } from "@/api/job.api";
import CustomDatePicker from "@/common/DatePicker";
import InputField from "@/common/InputField";
import useProfileForm from "@/hooks/validation/user/Job/useProfileForm";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/store/auth.store";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import Selecter from "../../../common/Selecter";
import { useCurrentyAvailabilityOptions, usePronounOptions } from "../../../utils/selectOptions";

const ApplyNowForm = ({ jobId }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    // portfolioUrl: "",
    pronouns: "",
    location: "",
    preferredStartDate: "",
    expYears: "",
    currentAvailability: "",
    salaryExpectation: "",
    salaryExpectationMax: "",
    notes: "",
    message: "",
    expYears: "0",
    attachments: "",
  });

  const availabilityOptions = useCurrentyAvailabilityOptions();
  const [selectedFile, setSelectedFile] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const fileInputRef = useRef(null);
  const additionalFilesRef = useRef(null);
  const { errors, setErrors, validateForm, clearFieldError } = useProfileForm();
  const { user } = useAuthStore();
  const router = useRouter();
  const r = useTranslations("UserProfile.resume");
  const t = useTranslations("UserProfile.profile");
  const pronounOptions = usePronounOptions();
  const [isChecked, setIsChecked] = useState(false);
  const [fileError, setFileError] = useState("");
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

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhoneChange = useCallback(
    (e) => {
      const { value } = e.target;
      const formattedValue = value.replace(/[^\d\s+\-()]/g, "");
      setFormData((prev) => ({ ...prev, phone: formattedValue }));
      if (formattedValue.trim() !== "") {
        clearFieldError(t("phone"));
      }
    },
    [clearFieldError]
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setErrors((prev) => ({ ...prev, cv: r("fileSizeError") }));
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      clearFieldError(t("cv"));
    }
  };

  const handleDateChange = useCallback(
    (date) => {
      setFormData((prev) => ({ ...prev, preferredStartDate: date }));
      clearFieldError(t("preferredStartDate"));
    },
    [clearFieldError]
  );

  const handleAdditionalFilesChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    let hasError = false;

    const validFiles = files.filter((file) => {
      if (file.size > 1024 * 1024) {
        hasError = true;
        return false;
      }
      return true;
    });

    if (hasError) {
      setFileError(r("eachFileSizeError"));
    } else {
      setFileError(""); // clear error when all valid
    }

    if (validFiles.length > 0) {
      setAdditionalFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeAdditionalFile = (index) => {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm({ ...formData, cv: selectedFile })) {
      return;
    }

    if (!isChecked) {
      toast.warning("Please check select the checkbox to apply for the job");
      return;
    }

    // Validate file extension
    const validExtensions = [".pdf", ".doc", ".docx", ".tex", ".webp"];
    const fileExtension = selectedFile?.name.split(".").pop();

    if (selectedFile && !validExtensions.includes(`.${fileExtension.toLowerCase()}`)) {
      setErrors({ ...errors, cv: t("InvalidFileFormatError") });
      return;
    }

    const submitData = new FormData();
    submitData.append("jobId", jobId);
    submitData.append("userId", user?._id);

    // Required fields
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);

    // Append CV file
    if (selectedFile) {
      submitData.append("appliedCV", selectedFile);
    }

    // Optional fields - only append if they have values
    if (formData.phone) submitData.append("phone", formData.phone);
    if (formData.linkedinUrl) submitData.append("linkedinUrl", formData.linkedinUrl);
    // if (formData.portfolioUrl) submitData.append("portfolioUrl", formData.portfolioUrl);
    if (formData.pronouns) submitData.append("pronouns", formData.pronouns);
    if (formData.location) submitData.append("location", formData.location);
    if (formData.preferredStartDate)
      submitData.append("preferredStartDate", formData.preferredStartDate);
    if (formData.currentAvailability)
      submitData.append("currentAvailability", formData.currentAvailability);
    if (formData.salaryExpectation)
      submitData.append("salaryExpectation", formData.salaryExpectation);

    if (formData.message) submitData.append("message", formData.message);
    if (formData.notes) submitData.append("notes", formData.notes);
    // Additional files
    additionalFiles.forEach((file) => {
      submitData.append("attechments", file);
    });

    try {
      const response = await applyJob(submitData);
      if (response.success) {
        toast.success(response.message);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          linkedinUrl: "",
          // portfolioUrl: "",
          pronouns: "",
          location: "",
          preferredStartDate: "",
          currentAvailability: "",
          salaryExpectation: "",
          salaryExpectationMax: "",
          message: "",
        });
        setSelectedFile(null);
        setAdditionalFiles([]);
        setIsChecked(false);

        setTimeout(() => {
          router.push("/jobs/applied-jobs");
        }, 1500);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || t("Failedtoapplyjob"));
    }
  };

  return (
    <div className="mx-auto h-fit w-full rounded-lg bg-white p-2 text-[14px] font-normal shadow-sm sm:p-[20px] xl:max-w-[747px]">
      <form onSubmit={handleSubmit}>
        <h2 className="mb-4 text-left text-[16px] font-medium text-black">
          {t("RequiredInformation")}
        </h2>

        <div className="grid grid-cols-1 gap-y-2.5">
          <InputField
            label={t("fullName")}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <InputField
            label={t("emaill")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <div className="mb-4">
            <label className="text-grayBlueText mb-1 block text-[14px]">
              {t("ResumeCVUpload")}
            </label>
            <div className="relative flex h-22 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-[0.78px] border-[#CAB7CC]/[75%] p-4">
              <label
                htmlFor="cv"
                className="flex cursor-pointer flex-row items-center justify-center gap-2 text-[14px] font-medium text-[#0F8200]"
              >
                <div onClick={handleFileButtonClick}>
                  <FiUpload className="text-2xl" />
                </div>
                {t("UploadCV")}
              </label>

              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.doc,.docx,.tex"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              // required
              />

              <p className="mt-2 text-[12px] text-gray-600">
                {selectedFile ? ` ${selectedFile.name}` : t("allowedTypes")}
              </p>
            </div>
            {errors.cv && <p className="mt-1 text-sm text-red-500">{errors.cv}</p>}
          </div>
          <div className="mb-4">
            <label className="text-grayBlueText mb-1 block text-[14px]">{`${t("CoverLetter")}*`}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-[0.78px] border-[#CAB7CC]/[75%] p-2 outline-none"
              rows="4"
              placeholder={t("Writeyourmessage")}
            />
            {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
          </div>

          <h2 className="mt-2 mb-2 text-left text-[16px] font-medium text-black">
            {t("OptionalInformation")}
          </h2>

          <InputField
            label={t("phoneNumber")}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            error={errors.phone}
          />

          <InputField
            label={t("linkedinUrl")}
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
          />
          {/* 
          <InputField
            label={t("portfolioUrl")}
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleChange}
          /> */}

          <Selecter
            name="pronoun"
            label={`${t("pronoun")}`}
            placeholder={t("pronounPlaceholder")}
            value={formData.pronoun}
            onChange={handleChange}
            options={pronounOptions}
            isOther={true}
          />

          <InputField
            label={t("location")}
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            placeholder={t("Enteryourlocation")}
          />

          <CustomDatePicker
            value={formData.preferredStartDate}
            onChange={handleDateChange}
            label={`${t("PreferredStartDate")} `}
          />

          <Selecter
            name="currentAvailability"
            label={`${t("availability")} `}
            placeholder={t("Selectyouravailabilty")}
            value={formData.currentAvailability}
            onChange={handleChange}
            options={availabilityOptions}
            error={errors.currentAvailability}
            isOther={true}
            isClearable={true}
          />
          <div className="mb-4 grid grid-cols-1 gap-4">
            <div>
              <label className="text-grayBlueText mb-1 block text-[14px]">
                {t("SalaryExpectation")}
              </label>
              <input
                type="text"
                name="salaryExpectation"
                value={formData.salaryExpectation}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-[0.78px] border-[#CAB7CC]/[75%] p-2 outline-none"
                placeholder={t("EnterSalaryExpectation")}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-grayBlueText mb-1 block text-[14px]">
              {t("AdditionalFiles")}
            </label>
            <div className="relative flex h-28 sm:h-22 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-[0.78px] border-[#CAB7CC]/[75%] p-4">
              <input
                type="file"
                multiple
                ref={additionalFilesRef}
                onChange={handleAdditionalFilesChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <FiUpload className="text-2xl text-[#0F8200]" />
              <p className="mt-2 text-[12px] text-gray-600">{t("UploadAdditionalFiles")}</p>
            </div>
            {fileError && <p className="mt-1 text-sm text-red-500">{fileError}</p>}
            {additionalFiles.length > 0 && (
              <div className="mt-2">
                {additionalFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAdditionalFile(index)}
                      className="text-red-500"
                    >
                      {t("Remove")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="text-grayBlueText mb-1 block text-[14px]">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-[0.78px] border-[#CAB7CC]/[75%] p-2 outline-none"
              rows="4"
              placeholder={t("Writeyourmessage")}
            />
          </div>
        </div>

        <div className="mt-6 mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <input
              id="apply-checkbox"
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="border-grayBlueText/[50%] focus:ring-primary h-4 w-4 border bg-gray-100 text-blue-600 focus:ring-1"
            />
            <label
              htmlFor="apply-checkbox"
              className="text-grayBlueText text-sm text-[13px] leading-[21px]"
            >
              {t("Byapplyingjob")}
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="hover:text-primary bg-primary hover:border-primary hover:bg-secondary/50 mt-3 w-full rounded-md border border-transparent p-1 text-[18px] font-medium text-white transition-all duration-100 ease-in sm:mt-5 sm:p-2 sm:text-[14px]"
        >
          {t("SubmitApplication")}
        </button>
      </form>
    </div>
  );
};

export default ApplyNowForm;
