"use client";

import CustomDatePicker from "@/common/DatePicker";
import InputField from "@/common/InputField";
import Selecter from "@/common/Selecter";
import JobTypeButton from "@/components/user/createUserProfile/JobTypeButton";
import {
  useCurrencyOptions,
  useIndustryOptions,
  useJobTypeOptions,
  useRoleOptions,
  useWorkLocationOptions,
} from "@/utils/selectOptions";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const JobPreferencesForm = forwardRef(
  ({ initialData, errors = {}, clearFieldError, availability }, ref) => {
    const [localData, setLocalData] = useState({
      jobRole: "",
      jobType: "",
      salaryRange: "",
      currency: "USD",
      joindate: "",
      workLocation: "",
      experience: "",
      industry: "",
    });
    const t = useTranslations("UserProfile.preferences");
    const roleOptions = useRoleOptions();
    const jobTypeOptions = useJobTypeOptions();
    const workLocationOptions = useWorkLocationOptions();
    const industryOptions = useIndustryOptions();
    const currencyOptions = useCurrencyOptions();

    useEffect(() => {
      if (initialData) {
        // Handle date format conversion for "21-10-2025T18:30:00.000Z" format
        let joindateValue = "";
        if (initialData.availableFrom) {
          if (typeof initialData.availableFrom === 'string') {
            let dateString = initialData.availableFrom;
            
            // Handle custom format "21-10-2025T18:30:00.000Z" by converting to standard ISO format
            if (dateString.includes('-') && dateString.includes('T')) {
              // Convert "21-10-2025T18:30:00.000Z" to "2025-10-21T18:30:00.000Z"
              const parts = dateString.split('T')[0].split('-'); // ["21", "10", "2025"]
              if (parts.length === 3) {
                const [day, month, year] = parts;
                dateString = `${year}-${month}-${day}`;
                console.log("JobPreferencesForm - Converted date format:", dateString);
              }
            }
            
            const dateObj = new Date(dateString);
            // Check if it's a valid date
            if (!isNaN(dateObj.getTime())) {
              joindateValue = dateObj;
              console.log("JobPreferencesForm - Date converted successfully:", joindateValue);
            } else {
              console.log("JobPreferencesForm - Invalid date after conversion:", dateString);
            }
          } else if (initialData.availableFrom instanceof Date) {
            joindateValue = initialData.availableFrom;
          }
        }
        
        // Normalize jobType from initialData to English value
        let normalizedJobType = "";
        const jobTypeOptionObjs = jobTypeOptions; // objects with {label, value}
        if (Array.isArray(initialData.jobType)) {
          const jt = initialData.jobType[0] || "";
          const found = jobTypeOptionObjs.find(
            (opt) => opt.value === jt || opt.label === jt
          );
          normalizedJobType = found ? found.value : jt;
        } else if (typeof initialData.jobType === "string") {
          const jt = initialData.jobType;
          const found = jobTypeOptionObjs.find(
            (opt) => opt.value === jt || opt.label === jt
          );
          normalizedJobType = found ? found.value : jt;
        }

        setLocalData({
          jobRole: initialData.jobRole || "",
          jobType: normalizedJobType,
          salaryRange: initialData.expectedSalaryRange || "",
          joindate: joindateValue,
          workLocation: initialData.preferredLocation || "",
          currency: initialData.currency || "USD",
          // experience:
          //   initialData.yearsOfExperience !== undefined
          //     ? String(initialData.yearsOfExperience)
          //     : "",
          experience: initialData.yearsOfExperience || undefined,
          industry: initialData.preferredIndustry || "",
        });
      }
    }, [initialData]);

    useImperativeHandle(ref, () => ({
      getData: () => localData,
    }));

    const handleChange = (e) => {
      const { name, value } = e.target;
      // For experience field, only set value if it's not empty
      if (name === "experience") {
        setLocalData((prev) => ({
          ...prev,
          [name]: value.trim() === "" ? undefined : value,
        }));
      } else {
        setLocalData((prev) => ({ ...prev, [name]: value }));
      }
      if (clearFieldError) clearFieldError(name);
    };

    const handleJobTypeChange = (type) => {
      setLocalData((prev) => ({ ...prev, jobType: type }));
      if (clearFieldError) clearFieldError("jobType");
    };

    const handleDateChange = (val) => {
      setLocalData((prev) => ({ ...prev, joindate: val }));
      if (clearFieldError) clearFieldError("joindate");
    };

    return (
      <div className="space-y-4">
        <p className="mb-2 py-1 text-lg font-semibold text-gray-800">{t("JobPreferences")}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Selecter
            name="jobRole"
            label="Job Role*"
            value={localData.jobRole}
            onChange={handleChange}
            error={errors.jobRole}
            options={roleOptions}
            isClearable
            placeholder="Select Job Role"
            className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border-gray-300"
          />
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-[14px] font-medium text-gray-700">
              {t("jobstype")}
            </label>
            <div className="flex flex-wrap gap-3">
              {jobTypeOptions.map((opt) => (
                <JobTypeButton
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selectedValue={localData.jobType || ""}
                  onClick={(val) => handleJobTypeChange(val)}
                />
              ))}
            </div>
            {/* {errors.jobType && <p className="mt-1 text-sm text-red-500">{errors.jobType}</p>} */}
          </div>
          {["Open to Work", "Available for Freelance"].includes(availability) && (
            <div>
              <InputField
                name="salaryRange"
                label={`${t("salaryrange")}`}
                value={localData.salaryRange}
                onChange={handleChange}
                // error={errors.salaryRange}
                placeholder="Enter salary range"
                className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border-gray-300"
              />
              <p className="text-xs text-gray-500 md:col-span-2">{t("salaryrangeError")}</p>
            </div>
          )}
          <div className="flex flex-col">
            <Selecter
              name="currency"
              label={`${t("currency") || "Currency"}*`}
              value={localData.currency}
              onChange={handleChange}
              options={currencyOptions}
              placeholder="Select Currency"
              isSearchable
            />
            <p className="mt-1 text-xs text-gray-500">{t("CurrencyDescription")}</p>
          </div>

        
          <div>
            <InputField
              name="experience"
              label={`${t("experience")}`}
              value={localData.experience || ""}
              onChange={handleChange}
              // error={errors.experience}
              type="number"
              max={50}
              placeholder="Enter years of experience"
              className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border-gray-300"
            />
            {/* <p className="text-xs text-gray-500 md:col-span-2">{t("experienceError")}</p> */}
          </div>
          <CustomDatePicker
          name="joindate"
          label={`${t("availablefrom")}`}
          value={localData.joindate}
          onChange={handleDateChange}
          error={errors.joindate}
          
          className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border-gray-300"
        />

          <Selecter
            label={`${t("worklocation")}`}
            name="workLocation"
            value={localData.workLocation}
            onChange={handleChange}
            // error={errors.workLocation}
            options={workLocationOptions}
            placeholder={t("SelectWorkLocation")}
            className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border-gray-300"
          />
          <Selecter
            label={`${t("industry")}`}
            name="industry"
            value={localData.industry}
            onChange={handleChange}
            // error={errors.industry}
            options={industryOptions}
            placeholder={t("SelectIndustry")}
            className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border-gray-300"
          />
        </div>
      </div>
    );
  }
);

export default JobPreferencesForm;
