"use client";

import CustomDatePicker from "@/common/DatePicker";
import InputField from "@/common/InputField";
import RadioGroup from "@/common/RadioGroup";
import SalaryRangeInput from "@/common/SalaryRangeInput";
import Selecter from "@/common/Selecter";
import ReusableForm from "@/components/form/ReusableForm";
import SkillsInput from "@/components/form/SkillsInput";
import useSalaryInfoValidation from "@/hooks/validation/job/useSalaryInfoValidation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";

const SalaryAndInfo = ({ formData, onChange, errors: parentErrors, onNext, onBack }) => {
  const { errors, setErrors, validateForm, clearError } = useSalaryInfoValidation();
  const t = useTranslations("CreateJobForm");

  // Merge parent errors with local errors for display
  useEffect(() => {
    if (parentErrors) {
      setErrors((prev) => ({ ...prev, ...parentErrors }));
    }
  }, [parentErrors, setErrors]);

  // Validate form data
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm(formData)) {
      return;
    }

    onNext();
  };

  const workModeOptions = [
    { value: "On-site", label: t("salaryStep.workMode.onSite") },
    { value: "Hybrid", label: t("salaryStep.workMode.hybrid") },
    { value: "Remote", label: t("salaryStep.workMode.remote") },
  ];

  const experienceOptions = [
    { value: "0", label: t("salaryStep.experience.fresher") },
    { value: "1", label: t("salaryStep.experience.one") },
    { value: "2", label: t("salaryStep.experience.two") },
    { value: "3", label: t("salaryStep.experience.three") },
    { value: "5", label: t("salaryStep.experience.fivePlus") },
    { value: "10", label: t("salaryStep.experience.tenPlus") },
  ];

  const educationOptions = [
    { value: "highschool", label: t("salaryStep.education.highSchool") },
    { value: "diploma", label: t("salaryStep.education.diploma") },
    { value: "bachelor", label: t("salaryStep.education.bachelor") },
    { value: "master", label: t("salaryStep.education.master") },
    { value: "phd", label: t("salaryStep.education.phd") },
    { value: "any", label: t("salaryStep.education.any") },
  ];

  const languageOptions = [
    { value: "english", label: t("salaryStep.languages.english") },
    { value: "spanish", label: t("salaryStep.languages.spanish") },
    { value: "french", label: t("salaryStep.languages.french") },
    { value: "german", label: t("salaryStep.languages.german") },
    { value: "chinese", label: t("salaryStep.languages.chinese") },
    { value: "japanese", label: t("salaryStep.languages.japanese") },
    { value: "arabic", label: t("salaryStep.languages.arabic") },
    { value: "hindi", label: t("salaryStep.languages.hindi") },
  ];

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Apply update
      onChange({ [name]: value });
      // Clear any errors related to this field
      if (errors[name]) {
        clearError(name);
      }
    },
    [onChange, errors, clearError]
  );

  const handleNegotiableChange = useCallback(
    (value) => {
      onChange({ negotiable: value === "yes" });
    },
    [onChange]
  );

  const handleSalaryChange = useCallback(
    (value) => {
      onChange({ salaryRange: value });

      if (errors.salaryRange) {
        clearError("salaryRange");
      }
    },
    [onChange, errors, clearError]
  );

  const handleDateChange = useCallback(
    (date) => {
      onChange({ applicationDeadline: date });

      if (errors.applicationDeadline) {
        clearError("applicationDeadline");
      }
    },
    [onChange, errors, clearError]
  );

  const handleLanguagesChange = useCallback(
    (languages) => {
      onChange({ languages });
    },
    [onChange]
  );

  const handleTagsChange = useCallback(
    (tags) => {
      onChange({ jobTags: tags });
    },
    [onChange]
  );

  return (
    <ReusableForm
      title={t("salaryStep.title")}
      maxWidth="max-w-[698px]"
      subtitle={t("common.subtitle")}
    >
      <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Work Mode - Mandatory */}

          {/* Salary Range and Negotiable Option */}
          <div>
            <div className="mb-2 flex items-center justify-between"></div>
            <SalaryRangeInput
              onSalaryChange={handleSalaryChange}
              initialValue={formData.salaryRange}
            />
            {errors.salaryRange && (
              <p className="mt-1 text-sm text-red-500">{errors.salaryRange}</p>
            )}
          </div>
          <div>
            <label className="text-grayBlueText text-[15px] font-medium">{t("salaryStep.negotiableLabel")} *</label>
            <RadioGroup
              name="negotiable"
              options={[
                { value: "yes", label: t("common.yes") },
                { value: "no", label: t("common.no") },
              ]}
              defaultValue={formData.negotiable ? "yes" : "no"}
              onChange={handleNegotiableChange}
              bordered={false}
              className="mt-2 flex-shrink-0"
            />
          </div>
          {!formData.isRemote && (
            <div>
              <label className="text-grayBlueText mb-2 block text-[15px] font-medium">
                {t("salaryStep.workModeLabel")} *
              </label>
              <Selecter
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                options={workModeOptions}
                error={errors.workMode}
                placeholder={t("salaryStep.workModePlaceholder")}
              />
            </div>
          )}

          {/* Contact Number - Mandatory */}
          <div>
            <label className="text-grayBlueText mb-2 block text-[15px] font-medium">
              {t("salaryStep.contactNumber")} *
            </label>
            <InputField
              type="number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder={t("salaryStep.contactNumberPlaceholder")}
              error={errors.contactNumber}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="text-grayBlueText mb-2 block text-[15px] font-medium">
                {t("salaryStep.applicationDeadline")} *
              </label>
              <CustomDatePicker
                value={formData.applicationDeadline}
                onChange={handleDateChange}
                minDate={new Date()}
                error={errors.applicationDeadline}
              />
            </div>

            <div>
              <label className="text-grayBlueText mb-2 block text-[15px] font-medium">
                {t("salaryStep.educationLabel")}
              </label>
              <Selecter
                name="education"
                value={formData.education}
                onChange={handleChange}
                options={educationOptions}
                isOther={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="text-grayBlueText mb-2 block text-[15px] font-medium">
                {t("salaryStep.experienceLabel")}
              </label>
              <Selecter
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                options={experienceOptions}
                placeholder={t("salaryStep.experiencePlaceholder")}
              />
            </div>

            {/* <div>
              <label className="text-grayBlueText mb-2 block text-[15px] font-medium">
                Number of Open Positions
              </label>
              <InputField
                type="number"
                name="openPositions"
                value={formData.openPositions}
                onChange={handleChange}
                placeholder="Enter number of positions"
                min="1"
              />
              </div> */}
            <div>
              <label className="text-grayBlueText mb-2 block text-[15px] font-medium">
                {t("salaryStep.requiredLanguages")}
              </label>
              <Selecter
                name="requiredLanguages"
                value={formData.requiredLanguages}
                onChange={handleChange}
                options={languageOptions}
                isMulti={true}
                isOther={true}
              />
            </div>
          </div>

          {/* Languages */}

          <div>
            <label className="text-grayBlueText mb-2 block text-[15px] font-medium">
              {t("salaryStep.numOfOpenPositions")}
            </label>
            <InputField
              type="number"
              name="numOfEmployee"
              value={formData.numOfEmployee}
              onChange={handleChange}
              placeholder={t("salaryStep.numOfOpenPositionsPlaceholder")}
              min="1"
            />
          </div>

          {/* Job Tags/Keywords */}
          <div>
            <label className="text-grayBlueText mb-2 block text-[15px] font-medium">
              {t("salaryStep.jobTags")}
            </label>
            <SkillsInput
              onSkillsChange={handleTagsChange}
              initialSkills={formData.jobTags || []}
              placeholder={t("salaryStep.jobTagsPlaceholder")}
            />
          </div>
        </div>

        <div className="flex gap-4.5 pt-2">
          <button type="button" className="btn-white-fill" onClick={onBack}>
            {t("common.back")}
          </button>
          <button type="submit" className="btn-fill">
            {t("common.next")}
          </button>
        </div>
      </form>
    </ReusableForm>
  );
};

export default SalaryAndInfo;
