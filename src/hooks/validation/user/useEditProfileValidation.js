"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const useEditProfileValidation = () => {
  const t = useTranslations("Validation");

  const [errors, setErrors] = useState({
    personal: {},
    job: {},
    education: {},
  });

  //
  const validatePersonalInfo = (data) => {
    const newErrors = {};

    // Required fields validation
    if (!data?.fullName?.trim()) {
      newErrors.fullName = t("personal.fullNameRequired");
    } else if (data.fullName.length < 3) {
      newErrors.fullName = t("personal.fullNameMin");
    }

    if (!data?.userName?.trim()) {
      newErrors.userName = t("personal.userNameRequired");
    } else if (data.userName.length < 3) {
      newErrors.userName = t("personal.userNameMin");
    }

    // if (!data?.gender) {
    //   newErrors.gender = t("personal.genderRequired");
    // }

    // if (!data?.dob) {
    //   newErrors.dob = t("personal.dobRequired");
    // } else {
    //   const dobDate = new Date(data.dob);
    //   const today = new Date();
    //   const age = today.getFullYear() - dobDate.getFullYear();
    //   if (age < 16) {
    //     newErrors.dob = t("personal.dobMinAge");
    //   }
    // }

    // if (!data?.dob) {
    //   newErrors.dob = t("personal.dobRequired");
    // } else {
    //   const dobDate = new Date(data.dob);
    //   const today = new Date();

    //   if (dobDate > today) {
    //     newErrors.dob = t("personal.dobFutureDateNotAllowed");
    //   } else {
    //     const age = today.getFullYear() - dobDate.getFullYear();
    //     const monthDiff = today.getMonth() - dobDate.getMonth();
    //     const dayDiff = today.getDate() - dobDate.getDate();

    //     const isBeforeBirthday = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0);
    //     const actualAge = isBeforeBirthday ? age - 1 : age;

    //     if (actualAge < 16) {
    //       newErrors.dob = t("personal.dobMinAge");
    //     }
    //   }
    // }

    if (!data?.phone?.trim()) {
      newErrors.phone = t("personal.phoneRequired");
    }

    if (!data?.location?.trim()) {
      newErrors.location = t("personal.locationRequired");
    }

    // // Optional fields validation
    // if (data?.linkedin && !data.linkedin.startsWith("https://www.linkedin.com/")) {
    //   newErrors.linkedin = t("personal.linkedinInvalid");
    // }

    if (!data?.email?.trim()) {
      newErrors.email = t("personal.emailRequired");
    }

    if (!data?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = t("personal.emailInvalid");
    }

    return newErrors;
  };

  const validateJobPreferences = (data, availability) => {
    // If availability is "Not Available", empty, or only whitespace, skip all job preference validations
    if (availability === "Not Available" || !availability || availability.trim() === "") {
      return {};
    }

    const newErrors = {};

    if (!data?.jobRole?.trim()) {
      newErrors.jobRole = t("job.jobRoleRequired");
    }

    // if (!data?.jobType) {
    //   newErrors.jobType = t("job.jobTypeRequired");
    // }

    // if (!data?.salaryRange) {
    //   newErrors.salaryRange = t("job.salaryRangeRequired");
    // }

    // if (!data?.workLocation?.trim()) {
    //   newErrors.workLocation = t("job.workLocationRequired");
    // }

    // if (!data?.experience) {
    //   newErrors.experience = t("job.experienceRequired");
    // }

    return newErrors;
  };

  const validateEducationAndSkills = (data) => {
    const newErrors = {};

    // Education validation
    if (!data?.educationList?.length) {
      newErrors.education = t("education.educationRequired");
    } else {
      data.educationList.forEach((edu, index) => {
        if (!edu.degree?.trim()) {
          newErrors[`education-${index}-degree`] = t("education.degreeRequired");
        }
        if (!edu.passingyear) {
          newErrors[`education-${index}-passingyear`] = t("education.passingYearRequired");
        } else {
          const year = parseInt(edu.passingyear);
          const currentYear = new Date().getFullYear();
          if (year > currentYear) {
            newErrors[`education-${index}-passingyear`] = t("education.passingYearFuture");
          }
        }
        // if (!edu.schoolname?.trim()) {
        //   newErrors[`education-${index}-schoolname`] = t("education.schoolRequired");
        // }
        if (!edu.board?.trim()) {
          newErrors[`education-${index}-board`] = t("education.boardRequired");
        }
      });
    }

    // Skills validation
    if (!data?.skillsList?.length) {
      newErrors.skills = t("skills.skillsRequired");
    } else {
      data.skillsList.forEach((skill, index) => {
        if (!skill.skill?.trim()) {
          newErrors[`skill-${index}-skill`] = t("skills.skillNameRequired");
        }
        if (!skill.proficiency) {
          newErrors[`skill-${index}-proficiency`] = t("skills.proficiencyRequired");
        }
        // if (!skill.experience) {
        //   newErrors[`skill-${index}-experience`] = t("skills.skillExperienceRequired");
        // }
        if (!skill.category) {
          newErrors[`skill-${index}-category`] = t("skills.categoryRequired");
        }
      });
    }

    // Languages validation (optional but if added, must be complete)
    // if (data?.languagesList?.length) {
    //   data.languagesList.forEach((lang, index) => {
    //     if (!lang.languages?.trim()) {
    //       newErrors[`language-${index}-languages`] = t("languages.languageNameRequired");
    //     }
    //     if (!lang.proficiency) {
    //       newErrors[`language-${index}-proficiency`] = t("languages.languageProficiencyRequired");
    //     }
    //   });
    // }

    // Experience validation (optional but if added, must be complete)
    // if (data?.experienceList?.length) {
    //   data.experienceList.forEach((exp, index) => {
    //     if (!exp.companyName?.trim()) {
    //       newErrors[`experience-${index}-companyName`] = t("experience.companyNameRequired");
    //     }
    //     if (!exp.role?.trim()) {
    //       newErrors[`experience-${index}-role`] = t("experience.roleRequired");
    //     }
    //     if (!exp.startDate) {
    //       newErrors[`experience-${index}-startDate`] = t("experience.startDateRequired");
    //     }
    //     if (!exp.location?.trim()) {
    //       newErrors[`experience-${index}-location`] = t("experience.locationRequired");
    //     }

    //     // Validate date ranges
    //     if (exp.startDate && exp.endDate) {
    //       const startDate = new Date(exp.startDate);
    //       const endDate = new Date(exp.endDate);
    //       if (endDate < startDate) {
    //         newErrors[`experience-${index}-endDate`] = t("experience.endDateBeforeStart");
    //       }
    //     }
    //   });
    // }

    return newErrors;
  };

  const validateAll = (personalData, preferencesData, educationSkillsData) => {
    const personalErrors = validatePersonalInfo(personalData || {});
    // console.log(personalData?.availabilty, "personalData?.availabilty");

    // Skip job preferences validation if availability is "Not Available"
    let jobErrors = {};
    jobErrors = validateJobPreferences(preferencesData || {}, personalData?.availabilty);

    const educationErrors = validateEducationAndSkills(educationSkillsData || {});

    const newErrors = {
      personal: personalErrors,
      job: jobErrors,
      education: educationErrors,
    };

    setErrors(newErrors);

    return (
      Object.keys(personalErrors).length === 0 &&
      Object.keys(jobErrors).length === 0 &&
      Object.keys(educationErrors).length === 0
    );
  };

  const clearError = (fieldName) => {
    // Determine which section the field belongs to
    let section = "personal";
    if (
      fieldName.startsWith("job") ||
      // fieldName === "experience" ||
      // fieldName === "workLocation" ||
      // fieldName === "salaryRange" ||
      // fieldName === "joindate"
      fieldName === "jobRole"
    ) {
      section = "job";
    } else if (
      fieldName.startsWith("education") ||
      fieldName.startsWith("skills") ||
      fieldName.startsWith("languages")
    ) {
      section = "education";
    }

    setErrors((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [fieldName]: undefined,
      },
    }));
  };

  const clearAllErrors = () => {
    setErrors({
      personal: {},
      job: {},
      education: {},
    });
  };

  return {
    errors,
    validateAll,
    clearError,
    clearAllErrors,
    validatePersonalInfo,
    validateJobPreferences,
    validateEducationAndSkills,
  };
};

export default useEditProfileValidation;
