"use client";
import InputField from "@/common/InputField";
import Selecter from "@/common/Selecter";
import SimpleLocationSelector from "@/common/SimpleLocationSelector";
import ReusableForm from "@/components/form/ReusableForm";
import useJobDetailsValidation from "@/hooks/validation/job/useJobDetailsValidation";
import useLocationStore from "@/store/location.store";
import { useDepartmentOptions, useEmployeTypeOptions } from "@/utils/selectOptions";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

const AddJobDetails = ({ formData, onChange, errors: parentErrors, onNext }) => {
  const { errors, setErrors, validateForm, clearError, clearLocationErrors } =
    useJobDetailsValidation();
  const [locationComplete, setLocationComplete] = useState(false);
  const { resetLocation } = useLocationStore();
  const tj = useTranslations("CreateJobForm");
  const t = useTranslations("CompanyProfile");
  // Check if location is complete with proper format (city, state, country)
  useEffect(() => {
    if (formData.jobLocation) {
      const parts = formData.jobLocation.split(",").map((part) => part.trim());
      setLocationComplete(parts.length >= 1 && parts[0]); // Only country required
    } else {
      setLocationComplete(false);
    }
  }, [formData.jobLocation]);

  // Reset location store when component unmounts
  useEffect(() => {
    return () => {
      resetLocation();
    };
  }, [resetLocation]);

  // Merge parent errors with local errors for display
  useEffect(() => {
    if (parentErrors) {
      setErrors((prev) => ({ ...prev, ...parentErrors }));
    }
  }, [parentErrors, setErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm(formData, locationComplete)) {
      return;
    }

    onNext();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is changed
    if (errors[name]) {
      clearError(name);
    }
  };
  const employetypeOptions = useEmployeTypeOptions();
  const departmentOptions = useDepartmentOptions();

  const handleLocationChange = useCallback(
    (val) => {
      if (val) {
        onChange({ jobLocation: val });

        // Only require country
        const parts = val.split(",").map((part) => part.trim());
        if (parts.length >= 1 && parts[0]) {
          setLocationComplete(true);
          clearError("jobLocation");
        } else {
          setLocationComplete(false);
        }
      }
    },
    [onChange, clearError]
  );

  // Handle location field change to clear errors
  const handleLocationFieldChange = useCallback(
    (fieldName) => {
      // This is called when an individual part of the location changes
      if (errors.jobLocation) {
        clearError("jobLocation");
      }
    },
    [errors.jobLocation, clearError]
  );

  const toggleRemote = useCallback(() => {
    onChange({ isRemote: !formData.isRemote });
    if (!formData.isRemote) {
      // If switching to remote, clear location-related fields
      onChange({
        jobLocation: "",
        jobArea: "",
      });
      setLocationComplete(false);

      // Reset location store to fix the reset issue
      resetLocation();

      // Clear location-related errors
      clearLocationErrors();
    }
  }, [formData.isRemote, onChange, resetLocation, clearLocationErrors]);

  return (
    <ReusableForm
      title={t("PostaNewJob")}
      maxWidth="max-w-[698px]"
      subtitle={t("AddJobDetailsSubtitle")}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
          <div className="col-span-12">
            <InputField
              label={t("JobTitle")}
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder={t("EnterJobTitle")}
              parentClassName="col-span-2"
              error={errors.jobTitle}
            />
          </div>
          <div className="col-span-12 md:col-span-6 ">
            <Selecter
              name="jobType"
              label={t("EmploymentType")}
              placeholder={t("SelectEmploymentType")}
              value={formData.jobType}
              onChange={handleChange}
              options={employetypeOptions}
              error={errors.jobType}
            />
          </div>
          <div className="col-span-12 md:col-span-6 ">
            <Selecter
              name="department"
              label={t("Department")}
              placeholder={t("SelectDepartment")}
              value={formData.department}
              onChange={handleChange}
              options={departmentOptions}
              error={errors.department}
            />
          </div>
          <div className="col-span-12 mb-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <label htmlFor="isRemote" className="flex items-center gap-2 font-medium text-gray-700">
              <span className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {t("RemoteJob")}
            </label>
            <button
              type="button"
              onClick={toggleRemote}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.isRemote ? "bg-primary" : "bg-gray-300"}`}
              role="switch"
              aria-checked={formData.isRemote}
            >
              <span className="sr-only">{t("Remotejobtoggle")}</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isRemote ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          {!formData.isRemote && (
            <>
              <div className="col-span-12 space-y-1">
                <label className="block text-sm font-medium text-gray-700">{t("JobLocation")}</label>
                <SimpleLocationSelector
                  value={formData.jobLocation}
                  onChange={handleLocationChange}
                  onFieldChange={handleLocationFieldChange}
                  error={errors.jobLocation}
                />
              </div>

              <InputField
                name="jobArea"
                label={t("fulladdress")}
                value={formData.jobArea}
                onChange={handleChange}
                placeholder={t("EnterJobArea")}
                parentClassName="col-span-2"
              />
            </>
          )}

          <div className="col-span-12">
            <button type="submit" className="btn-fill">
              {tj("common.next")}
            </button>
          </div>
        </div>
      </form>
    </ReusableForm>
  );
};

export default AddJobDetails;
