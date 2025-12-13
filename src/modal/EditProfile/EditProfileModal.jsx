"use client";

import Uploadimg from "@/assets/form/Uploadimg.png";
import ImageUploader from "@/common/ImageUploader";
import WhoCanSeeYourProfileWrapper from "@/components/user/createUserProfile/WhoCanSeeYourProfileWrapper";
import useUpdateProfile from "@/hooks/user/useUpdateProfile";
import useEditProfileValidation from "@/hooks/validation/user/useEditProfileValidation";
import getImg from "@/lib/getImg";
import useAuthStore from "@/store/auth.store";
import useLocationStore from "@/store/location.store";
import { useProficiencyOptions, useSkillCategoryOptions } from "@/utils/selectOptions";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "rsuite";
import EducationSkillsForm from "./EducationSkillsForm";
import JobPreferencesForm from "./JobPreferencesForm";
import PersonalInformationForm from "./PersonalInformationForm";

const EditProfileModal = ({ open, onClose, descriptionData }) => {
  const { user, setUser } = useAuthStore();
  // console.log(descriptionData);
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const r = useTranslations("UserProfile.resume");
  const t = useTranslations("UserProfile.education");
  const { resetLocation } = useLocationStore();

  // Use the centralized validation hook
  const { errors, validateAll, clearError, clearAllErrors } = useEditProfileValidation();

  // Refs to collect data from children
  const personalRef = useRef();
  const jobRef = useRef();
  const educationSkillsRef = useRef();
  const whoCanSeeRef = useRef();
  const resumeInputRef = useRef(null);

  // Image state
  const [selectedImage, setSelectedImage] = useState(Uploadimg);
  const [selectedUserImageFile, setSelectedUserImageFile] = useState(null);
  const [availability, setAvailability] = useState(descriptionData?.profile?.availabilty || "");
  // console.log(descriptionData?.profile?.availabilty, "availabilit0---------y");
  // Proficiency options for skills/languages
  const proficiencyOptions = useProficiencyOptions();
  const categoryOptions = useSkillCategoryOptions();
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [existingResume, setExistingResume] = useState(descriptionData?.resume || null);
  const [resumeRemoved, setResumeRemoved] = useState(false);
  const [resumeError, setResumeError] = useState("");
  // console.log(selectedResumeFile, "selectedResumeFile");

  const handleAvailabilityChange = (newAvailability) => {
    setAvailability(newAvailability);
  };
  useEffect(() => {
    if (descriptionData?.resume) {
      setExistingResume(user?.resume);
      // console.log(existingResume, "existingResume");
    }
  }, [descriptionData, user?.resume]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get data from all forms
    const personalData = personalRef.current?.getData();
    const preferencesData = jobRef.current?.getData();
    const educationData = educationSkillsRef.current?.getData();

    // Validate all forms using the centralized validation
    const isValid = validateAll(personalData, preferencesData, educationData);

    // If validation fails, stop form submission
    if (!isValid) {
      // console.log("Form validation failed:", errors);
      return;
    }

    // Block submit if resume validation failed
    if (resumeError) {
      return;
    }

    // Clear all errors if validation passes
    clearAllErrors();

    const formData = new FormData();

    // Profile fields
    formData.append("profile.fullName", personalData.fullName);
    formData.append("profile.userName", personalData.userName);
    formData.append("profile.gender", personalData.gender);
    formData.append("profile.dob", personalData.dob);
    formData.append("profile.phone", personalData.phone);
    formData.append("profile.location", personalData.location);
    formData.append("profile.pronounce", personalData.pronoun);
    formData.append("profile.isPrivate", personalData.isPrivate);
    formData.append("profile.availabilty", availability);
    formData.append("profile.linkedin", personalData.linkedin);
    formData.append("profile.instagram", personalData.instagram);
    formData.append("profile.x", personalData.x);
    formData.append("profile.facebook", personalData.facebook);
    formData.append("profile.email", personalData.email);
    formData.append("profile.short_bio", personalData.short_bio);

    // Preferences fields - only append if availability is not "Not Available"
    if (availability !== "Not Available" && availability !== "" && availability?.trim() !== "") {
      formData.append("preferences.jobRole", preferencesData.jobRole);
      formData.append("preferences.jobType", preferencesData.jobType);
      formData.append("preferences.expectedSalaryRange", preferencesData.salaryRange);
      formData.append("preferences.currency", preferencesData.currency);
      formData.append("preferences.availableFrom", preferencesData.joindate);
      formData.append("preferences.preferredLocation", preferencesData.workLocation);
      // Experience field is optional - only send if it has a valid value
      if (preferencesData?.experience && String(preferencesData?.experience).trim() !== "") {
        formData.append("preferences.yearsOfExperience", preferencesData?.experience);
      }
      if (preferencesData.industry)
        formData.append("preferences.preferredIndustry", preferencesData.industry);
    }

    // Education
    educationData.educationList?.forEach((edu, i) => {
      formData.append(`education[${i}][degreeName]`, edu.degree);
      formData.append(`education[${i}][passingYear]`, edu.passingyear);
      formData.append(`education[${i}][schoolOrCollege]`, edu.schoolname);
      formData.append(`education[${i}][universityOrBoard]`, edu.board);
    });

    // Skills
    educationData.skillsList?.forEach((skill, i) => {
      formData.append(`skills[${i}][name]`, skill.skill);
      formData.append(`skills[${i}][proficiencyLevel]`, skill.proficiency);
      formData.append(`skills[${i}][yearsOfExperience]`, skill.experience);
      formData.append(`skills[${i}][category]`, skill.category);
    });

    // Languages
    educationData.languagesList?.forEach((lang, i) => {
      formData.append(`languages[${i}][name]`, lang.languages);
      formData.append(`languages[${i}][proficiency]`, lang.proficiency);
    });

    // Experience
    educationData.experienceList?.forEach((exp, i) => {
      formData.append(`experience[${i}][companyName]`, exp.companyName);
      formData.append(`experience[${i}][jobTitle]`, exp.role);
      formData.append(`experience[${i}][startDate]`, exp.startDate);
      if (exp.endDate) formData.append(`experience[${i}][endDate]`, exp.endDate);
      formData.append(`experience[${i}][location]`, exp.location);
      formData.append(`experience[${i}][position]`, exp.position);
    });

    // Photo
    if (selectedUserImageFile instanceof File && selectedImage !== Uploadimg) {
      formData.append("profile.photo", selectedUserImageFile);
    }

    // Visibility (WhoCanSeeYourProfile)
    const whoCanSeeData = whoCanSeeRef.current?.getData?.();
    if (whoCanSeeData) {
      formData.append("visibility.isPublic", whoCanSeeData.isPublic);
      formData.append(
        "visibility.onlyLGBTQFriendlyCompanies",
        whoCanSeeData.onlyLGBTQFriendlyCompanies
      );
      formData.append("visibility.visibleTo", whoCanSeeData.visibleTo);
    }

    if (selectedResumeFile instanceof File) {
      formData.append("resume", selectedResumeFile);
    } else if (resumeRemoved && !existingResume) {
      // Explicitly tell backend to remove resume
      formData.append("resumeRemoved", "true");
      formData.append("resume", "");
    }
    updateProfile(formData, {
      onSuccess: (res) => {
        if (res.success) {
          onClose();
          // window.location.reload();
        }
      },
    });
  };

  useEffect(() => {
    if (descriptionData?.profile?.photo) {
      setSelectedImage(getImg(descriptionData?.profile?.photo));
    }
    // Set default availability when modal opens
    if (descriptionData?.profile?.availabilty) {
      setAvailability(descriptionData?.profile?.availabilty);
    }
  }, [descriptionData]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setResumeError(r("fileSizeError"));
        setSelectedResumeFile(null);
        if (resumeInputRef.current) {
          resumeInputRef.current.value = "";
        }
        return;
      }
      setSelectedResumeFile(file);
      setResumeError("");
    }
  };

  const handleRemoveSelectedResume = () => {
    setSelectedResumeFile(null);
    setResumeError("");
    setResumeRemoved(true);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  const handleRemoveExistingResume = () => {
    setExistingResume(null);
    setSelectedResumeFile(null);
    setResumeError("");
    setResumeRemoved(true);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      className="mx-auto w-full max-w-lg rounded-2xl !p-0"
    >
      <Modal.Header className="flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-white px-2 py-2 md:px-6 md:py-4">
        <Modal.Title className="text-xl font-bold text-gray-800">{t("editProfile")}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="space-y-6 bg-white px-2 py-2 md:px-6 md:py-4">
        <div className="mt-2 flex flex-col items-center justify-center gap-2 sm:mt-0">
          <div className="relative">
            <ImageUploader
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              setSelectedImageFile={setSelectedUserImageFile}
              width={112}
              height={112}
              className="border-primary-500 h-28 w-28 rounded-full border-4 object-cover shadow-lg"
              priority={true}
              enableCropping={true}
              aspectRatio={1}
              isRounded={true}
            />
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
          <PersonalInformationForm
            ref={personalRef}
            initialData={descriptionData?.profile}
            email={descriptionData?.email}
            errors={errors?.personal || {}}
            clearFieldError={clearError}
            onAvailabilityChange={handleAvailabilityChange}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          />
        </div>
        {availability !== "Not Available" && availability !== "" && availability?.trim() !== "" && (
          <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
            <JobPreferencesForm
              ref={jobRef}
              initialData={descriptionData?.preferences}
              errors={errors?.job || {}}
              availability={availability}
              clearFieldError={clearError}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            />
          </div>
        )}
        <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
          <EducationSkillsForm
            categoryOptions={categoryOptions}
            ref={educationSkillsRef}
            initialData={{
              education: descriptionData?.education,
              skills: descriptionData?.skills,
              languages: descriptionData?.languages,
              experience: descriptionData?.experience,
            }}
            errors={errors?.education || {}}
            clearFieldError={clearError}
            proficiencyOptions={proficiencyOptions}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          />
        </div>
        <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
          <div className="my-2 flex flex-col gap-3">
            <div>
              <div className="text-lg font-semibold text-gray-800">{r("title")}</div>
              <p className="mt-1 text-xs text-gray-500">
                {r("docType")}
              </p>
            </div>

            {existingResume && !selectedResumeFile ? (
              <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={getImg(existingResume)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-xs truncate text-sm font-medium text-primary-600 hover:underline"
                >
                  {r("viewExistingCv")}
                </a>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      // Replace: clear current resume and open file picker
                      handleRemoveExistingResume();
                      if (resumeInputRef.current) {
                        resumeInputRef.current.click();
                      }
                    }}
                    className="rounded-md border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
                  >
                    {r("Replace")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRemoveExistingResume}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    {r("Remove")}
                  </Button>
                </div>
              </div>
            ) : selectedResumeFile ? (
              <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <span
                  className="mr-3 max-w-xs truncate text-sm text-gray-700"
                  title={selectedResumeFile.name}
                >
                  {selectedResumeFile.name}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleRemoveSelectedResume}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    {r("Remove")}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="cv"
                  className="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-white px-4 py-6 text-center shadow-sm transition hover:border-primary-500 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">
                    {r("ClickToUpload")}
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    {r("docType")}
                  </span>
                  <input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    ref={resumeInputRef}
                    className="hidden"
                  />
                </label>
                {resumeError && (
                  <p className="mt-2 text-xs text-red-500">{resumeError}</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
          <WhoCanSeeYourProfileWrapper
            ref={whoCanSeeRef}
            initialData={descriptionData?.visibility}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-200 bg-white px-2 py-2 md:px-6 md:py-4">
        <Button
          onClick={onClose}
          appearance="subtle"
          className="rounded-lg border border-gray-300 px-6 py-2 text-gray-600 transition hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          appearance="primary"
          className="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-2 font-semibold text-white shadow transition"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
