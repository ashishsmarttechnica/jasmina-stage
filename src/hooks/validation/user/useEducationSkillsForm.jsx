import { useTranslations } from "next-intl";
import { useState } from "react";

const useEducationSkillsForm = () => {
  const [errors, setErrors] = useState({});
  const t = useTranslations("UserProfile.education");
  const validateForm = ({ educationList, skillsList, languagesList, experienceList }) => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    educationList.forEach((edu, index) => {
      if (!edu.degree) newErrors[`education-${index}-degree`] = t("degreeError");

      // Enhanced passing year validation
      if (!edu.passingyear) {
        newErrors[`education-${index}-passingyear`] = t("passingYearError");
      } else {
        const year = parseInt(edu.passingyear);
        if (isNaN(year)) {
          newErrors[`education-${index}-passingyear`] =
            t("invalidYearError") || "Please enter a valid year";
        } else if (year < 1950 || year > currentYear + 10) {
          newErrors[`education-${index}-passingyear`] =
            t("invalidYearError") || `Year must be between 1950 and ${currentYear + 10}`;
        }
      }

      // if (!edu.schoolname) newErrors[`education-${index}-schoolname`] = t("schoolNameError");
      if (!edu.board) newErrors[`education-${index}-board`] = t("boardError");
    });

    skillsList.forEach((skill, index) => {
      if (!skill.skill) newErrors[`skill-${index}-skill`] = t("skillError");
      if (!skill.proficiency) newErrors[`skill-${index}-proficiency`] = t("proficiencyError");
      // if (!skill.experience) newErrors[`skill-${index}-experience`] = t("experienceError");
      if (!skill.category) newErrors[`skill-${index}-category`] = t("categoryError");
    });

    languagesList.forEach((lang, index) => {
      // Make both fields optional: only check for duplicate if language is selected
      if (lang.languages) {
        // Check for duplicate language selections
        const firstOccurrenceIndex = languagesList.findIndex(
          (l) => l.languages === lang.languages && lang.languages
        );
        if (firstOccurrenceIndex !== index && firstOccurrenceIndex !== -1) {
          newErrors[`language-${index}-languages`] =
            t("duplicateLanguageError") || "This language has already been selected";
        }
        // Proficiency is only required if language is selected
        if (!lang.proficiency) newErrors[`language-${index}-proficiency`] = t("proficiencyError");
      } else if (lang.proficiency) {
        // If proficiency is filled but language is not, show error for language
        newErrors[`language-${index}-languages`] = t("languageError");
      }
    });

    // experienceList.forEach((exp, index) => {
    //   if (!exp.companyName) newErrors[`experience-${index}-companyName`] = t("companyNameError");
    //   if (!exp.role) newErrors[`experience-${index}-role`] = t("roleError");
    //   if (!exp.startDate) newErrors[`experience-${index}-startDate`] = t("startDateError");
    //   if (!exp.endDate) newErrors[`experience-${index}-endDate`] = t("endDateError");
    //   if (!exp.location) newErrors[`experience-${index}-location`] = t("locationError");
    //   if (!exp.position) newErrors[`experience-${index}-position`] = t("positionError");

    //   // Date validation: Check if end date is before start date
    //   if (exp.startDate && exp.endDate) {
    //     const startDate = new Date(exp.startDate);
    //     const endDate = new Date(exp.endDate);
    //     if (endDate < startDate) {
    //       newErrors[`experience-${index}-endDate`] = t("endDateBeforeStartError");
    //     }
    //   }
    // });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldKey) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldKey];
      return updated;
    });
  };

  return { errors, validateForm, clearFieldError };
};

export default useEducationSkillsForm;
