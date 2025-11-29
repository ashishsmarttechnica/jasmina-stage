"use client";

import InputField from "@/common/InputField";
import ReusableForm from "@/components/form/ReusableForm";
import useJobApplicationValidation from "@/hooks/validation/job/useJobApplicationValidation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";

const PostNewJob = ({
  formData,
  onChange,
  errors: parentErrors,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const { errors, setErrors, validateForm, clearError } = useJobApplicationValidation();
  const t = useTranslations("CreateJobForm");

  // Merge parent errors with local errors for display
  useEffect(() => {
    if (parentErrors) {
      setErrors((prev) => ({ ...prev, ...parentErrors }));
    }
  }, [parentErrors, setErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm(formData)) {
      return;
    }

    onSubmit();
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      onChange({ [name]: value });

      // Clear error when field is changed
      if (errors[name]) {
        clearError(name);
      }
    },
    [onChange, errors, clearError]
  );

  return (
    <ReusableForm
      title={t("submitStep.title")}
      maxWidth="max-w-[698px]"
      subtitle={t("submitStep.subtitle")}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-4 border-gray-200">
          <InputField
            label={t("submitStep.applyEmailLabel")}
            name="applyVia"
            type="email"
            value={formData.applyVia}
            onChange={handleChange}
            placeholder={t("submitStep.applyEmailPlaceholder")}
            disabled={isSubmitting}
          />

          <InputField
            label={t("submitStep.applyLinkLabel")}
            name="careerWebsite"
            type="text"
            value={formData.careerWebsite}
            onChange={handleChange}
            placeholder={t("submitStep.applyLinkPlaceholder")}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-4.5 pt-4">
          <button type="button" className="btn-white-fill" onClick={onBack} disabled={isSubmitting}>
            {t("common.back")}
          </button>
          <button
            type="submit"
            className={`btn-fill flex items-center justify-center ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("submitStep.submitting")}
              </>
            ) : (
              t("submitStep.postJob")
            )}
          </button>
        </div>
      </form>
    </ReusableForm>
  );
};

export default PostNewJob;
