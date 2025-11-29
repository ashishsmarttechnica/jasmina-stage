import CustomDatePicker from "@/common/DatePicker";
import InputField from "@/common/InputField";
import Selecter from "@/common/Selecter";
import ReusableForm from "@/components/form/ReusableForm";
import useUpdateProfile from "@/hooks/user/useUpdateProfile";
import usePreferencesForm from "@/hooks/validation/user/usePreferencesForm";
import useAuthStore from "@/store/auth.store";
import {
  useCurrencyOptions,
  useIndustryOptions,
  useJobTypeOptions,
  useRoleOptions,
  useWorkLocationOptions,
} from "@/utils/selectOptions";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Loader } from "rsuite";
import JobTypeButton from "./JobTypeButton";

const Preferences = ({ setActiveTab, availabilty, activeTab }) => {
  const { user, setUser } = useAuthStore();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const t = useTranslations("UserProfile.preferences");
  const { errors, setErrors, validateForm, clearFieldError } = usePreferencesForm();

  const roleOptions = useRoleOptions();
  const jobTypeOptions = useJobTypeOptions();
  const workLocationOptions = useWorkLocationOptions();
  const industryOptions = useIndustryOptions();
  const currencyOptions = useCurrencyOptions();
  // console.log(availabilty, "hhhhhhhhhhhhhh");

  const [formData, setFormData] = useState({
    role: "",
    jobType: "",
    salaryRange: "",
    currency: "USD", // Default currency
    joindate: "",
    workLocation: "",
    experience: "",
    industry: "",
  });

  // Debug: Track formData changes
  useEffect(() => {
    console.log("formData.joindate changed:", formData.joindate);
  }, [formData.joindate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() !== "") {
      clearFieldError(name);
    }
  };

  const handleDateChange = (date) => {
    console.log("handleDateChange called with:", date);
    
    if (date) {
      // Create a date object that avoids timezone issues
      // Use the date parts directly to avoid timezone conversion
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      
      // Create a new date object with noon time to avoid day boundary issues
      const safeDate = new Date(year, month, day, 12, 0, 0, 0);
      console.log("Safe date created:", safeDate);
      
      setFormData((prev) => ({ ...prev, joindate: safeDate }));
      clearFieldError("joindate");
    } else {
      setFormData((prev) => ({ ...prev, joindate: "" }));
    }
  };

  const handleJobTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, jobType: type }));
    if (type.trim() !== "") {
      clearFieldError("jobType");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(formData, availabilty)) return;
    const submitData = new FormData();
    submitData.append("preferences.jobRole", formData.role);
    submitData.append("preferences.jobType", formData.jobType);
    submitData.append("preferences.expectedSalaryRange", formData.salaryRange);
    submitData.append("preferences.currency", formData.currency);
    submitData.append("preferences.availableFrom", formData.joindate);
    submitData.append("preferences.preferredLocation", formData.workLocation);
    submitData.append("preferences.yearsOfExperience", +formData.experience);
    if (formData.industry.trim() !== "") {
      submitData.append("preferences.preferredIndustry", formData.industry);
    }
    submitData.append("steps", activeTab + 1);
    updateProfile(submitData, {
      onSuccess: (res) => {
        if (res.success) {
          setActiveTab(activeTab + 1);
        }
      },
    });
  };

  useEffect(() => {
    console.log("useEffect triggered, user:", user);
    if (user?.preferences) {
      console.log("user.preferences.availableFrom:", user.preferences.availableFrom);
      // Convert ISO date "2025-10-22T18:30:00.000Z" to "22-10-2025" format for editing
      let joindateValue = "";
      if (user.preferences.availableFrom) {
        // If it's a date string, convert to Date object
        if (typeof user.preferences.availableFrom === 'string') {
          let dateString = user.preferences.availableFrom;
          
          // Handle custom format "21-10-2025T18:30:00.000Z" by converting to standard ISO format
          if (dateString.includes('-') && dateString.includes('T')) {
            // Convert "21-10-2025T18:30:00.000Z" to "2025-10-21T18:30:00.000Z"
            const parts = dateString.split('T')[0].split('-'); // ["21", "10", "2025"]
            if (parts.length === 3) {
              const [day, month, year] = parts;
              dateString = `${year}-${month}-${day}`;
              console.log("Converted date format:", dateString);
            }
          }
          
          const dateObj = new Date(dateString);
          // Check if it's a valid date
          if (!isNaN(dateObj.getTime())) {
            // Create a safe date to avoid timezone issues
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth();
            const day = dateObj.getDate();
            joindateValue = new Date(year, month, day, 12, 0, 0, 0);
            console.log("Date converted successfully:", joindateValue);
          } else {
            console.log("Invalid date after conversion:", dateString);
          }
        } else if (user.preferences.availableFrom instanceof Date) {
          // Create a safe date to avoid timezone issues
          const year = user.preferences.availableFrom.getFullYear();
          const month = user.preferences.availableFrom.getMonth();
          const day = user.preferences.availableFrom.getDate();
          joindateValue = new Date(year, month, day, 12, 0, 0, 0);
        }
      } else {
        console.log("No availableFrom date found");
      }
      
      console.log("About to set formData with joindate:", joindateValue);
      setFormData((prev) => {
        const newData = {
          ...prev,
          role: user.preferences.jobRole || "",
          jobType: user.preferences.jobType[0] || "",
          salaryRange: user.preferences.expectedSalaryRange || "",
          currency: user.preferences.currency || "USD",
          joindate: joindateValue,
          workLocation: user.preferences.preferredLocation || "",
          experience: user.preferences.yearsOfExperience || "",
          industry: user.preferences.preferredIndustry || "",
        };
        console.log("New formData:", newData);
        return newData;
      });
    } else {
      console.log("No user or preferences found");
    }
  }, [user?.preferences?.availableFrom]);

  return (
    <ReusableForm title={t("title")} maxWidth="max-w-[698px]" subtitle={t("subTitle")}>
      <form className="w-full rounded-lg" onSubmit={handleSubmit}>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Selecter
            name="role"
            label={`${t("jobrole")}*`}
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
            options={roleOptions}
            placeholder={t("SelectJobRole")}
          />

          <div>
            <label className="text-grayBlueText mb-1 block text-[14px]">{`${t("jobtype")}*`}</label>
            <div className="grid grid-cols-3 gap-2">
              {jobTypeOptions.map((opt) => (
                <JobTypeButton
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selectedValue={formData.jobType}
                  onClick={handleJobTypeChange}
                  error={errors.jobType}
                />
              ))}
            </div>
            <div className="mt-1">
              {errors.jobType && <p className="text-sm text-red-500">{errors.jobType}</p>}
            </div>
          </div>

          {["Open to Work", "Available for Freelance", " "].includes(availabilty) && (
            <div className="flex flex-col">
              <InputField
                label={`${t("salaryrange")}*`}
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                error={errors.salaryRange}
                type="text"
              />
              <p className="mt-1 text-xs text-gray-500">{t("description")}</p>
            </div>
          )}

          <div className="flex flex-col">
            <Selecter
              name="currency"
              label={`${t("currency") || "Currency"}*`}
              value={formData.currency}
              onChange={handleChange}
              options={currencyOptions}
              placeholder="Select Currency"
              isSearchable
            />
            <p className="mt-1 text-xs text-gray-500">{t("CurrencyDescription")}</p>
          </div>

          <div className="flex flex-col">
            <InputField
              label={`${t("experience")}  `}
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              type="number"
              max={50}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <p className="mt-1 text-xs text-gray-500">{t("experienceDescription")}</p>
          </div>
          {/* <Selecter
            name="experience"
            label={t("experience")}
            value={formData.experience}
            onChange={handleChange}
            error={errors.experience}
            options={experienceOptions}
            placeholder={t("SelectExperience")}
          /> */}

          <CustomDatePicker
            value={formData.joindate}
            onChange={handleDateChange}
            error={errors.joindate}
            label={`${t("availablefrom")}*`}
            disabled={false}
          />

          <Selecter
            name="workLocation"
            label={`${t("worklocation")}*`}
            value={formData.workLocation}
            onChange={handleChange}
            error={errors.workLocation}
            options={workLocationOptions}
            placeholder={t("SelectWorkLocation")}
          />

          <Selecter
            name="industry"
            label={`${t("industry")}`}
            value={formData.industry}
            onChange={handleChange}
            options={industryOptions}
            placeholder={t("SelectIndustry")}
          />
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="grid grid-cols-2 gap-4">
            {activeTab > 0 && (
              <button
                type="button"
                className="btn-white-fill"
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={isPending}
              >
                {t("Back")} <span className="text-[20px]">&lt;</span>
              </button>
            )}

            <button className={`btn-fill ${activeTab > 0 ? "" : "col-span-2"}`}>
              {isPending ? (
                <div>
                  <Loader inverse />
                </div>
              ) : (
                `${t("Next")} >`
              )}
            </button>
          </div>
        </div>
      </form>
    </ReusableForm>
  );
};

export default Preferences;
