import RichTextEditor from "@/common/RichTextEditor";
import ReusableForm from "@/components/form/ReusableForm";
import SkillsInput from "@/components/form/SkillsInput";
import useSkillsValidation from "@/hooks/validation/job/useSkillsValidation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";

const AddSkillsTab = ({ formData, onChange, errors: parentErrors, onNext, onBack }) => {
  const { errors, setErrors, validateForm, clearError } = useSkillsValidation();
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

    onNext();
  };

  const handleContentChange = useCallback(
    (content) => {
      onChange({ responsibilities: content });

      // Clear error when content is changed and not empty
      if (content.trim() && errors.responsibilities) {
        clearError("responsibilities");
      }
    },
    [onChange, errors.responsibilities, clearError]
  );

  const handleSkillsChange = useCallback(
    (skills) => {
      onChange({ skills });

      // Clear error when skills are added
      if (skills.length > 0 && errors.skills) {
        clearError("skills");
      }
    },
    [onChange, errors.skills, clearError]
  );

  return (
    <ReusableForm
      title={t("skillsStep.title")}
      maxWidth="max-w-[698px]"
      subtitle={t("common.subtitle")}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <div className="text-grayBlueText ms-1 mb-1.5 text-sm">{t("skillsStep.responsibilitiesLabel")}</div>
          <RichTextEditor
            defaultValue={formData.responsibilities}
            onChange={handleContentChange}
            height="300px"
            className="job-application-editor"
          />
          {errors.responsibilities && (
            <p className="mt-1 text-sm text-red-500">{errors.responsibilities}</p>
          )}
        </div>

        <div>
          <div className="text-grayBlueText ms-1 mb-1.5 text-sm">{t("skillsStep.skillsLabel")}</div>
          <SkillsInput onSkillsChange={handleSkillsChange} initialSkills={formData.skills} />
          {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
        </div>

        <div className="flex gap-4.5">
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

export default AddSkillsTab;
