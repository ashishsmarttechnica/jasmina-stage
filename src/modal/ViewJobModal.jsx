"use client";
import InputField from "@/common/InputField";
import Selecter from "@/common/Selecter";
import SimpleLocationSelector from "@/common/SimpleLocationSelector";
import SkillsInput from "@/components/form/SkillsInput";
import { useSingleJob } from "@/hooks/job/useGetJobs";
import { useUpdateJob } from "@/hooks/job/useUpdateJob";
import useLocationStore from "@/store/location.store";
import { languageOptions } from "@/utils/languageOptions";
import { useDepartmentOptions, useEmployeTypeOptions } from "@/utils/selectOptions";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "rsuite";

const ViewJobModal = ({ isOpen, onClose, jobId, isEditMode = false }) => {
  const { data: jobData, isLoading, isError, error, refetch } = useSingleJob(jobId);
  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob();
  const [editMode, setEditMode] = useState(isEditMode);
  const [formData, setFormData] = useState({});
  const [locationComplete, setLocationComplete] = useState(false);
  const { resetLocation } = useLocationStore();
  const t = useTranslations("CompanyProfile");
  const tj = useTranslations("CreateJobForm");
  const tv = useTranslations("ViewJobModal");

  const employetypeOptions = useEmployeTypeOptions();
  const departmentOptions = useDepartmentOptions();

  // Seniority options
  const seniorityOptions = [
    { label: tj("requirementsStep.seniorityOptions.intern"), value: "intern" },
    { label: tj("requirementsStep.seniorityOptions.entryLevel"), value: "entry-level" },
    { label: tj("requirementsStep.seniorityOptions.midLevel"), value: "mid-level" },
    { label: tj("requirementsStep.seniorityOptions.senior"), value: "senior" },
    { label: tj("requirementsStep.seniorityOptions.leadManager"), value: "lead-manager" },
    { label: tj("requirementsStep.seniorityOptions.directorVp"), value: "director-vp" },
    { label: tj("requirementsStep.seniorityOptions.cLevel"), value: "c-level" },
  ];

  // Education options
  const educationOptions = [
    { value: "highschool", label: tj("salaryStep.education.highSchool") },
    { value: "diploma", label: tj("salaryStep.education.diploma") },
    { value: "bachelor", label: tj("salaryStep.education.bachelor") },
    { value: "master", label: tj("salaryStep.education.master") },
    { value: "phd", label: tj("salaryStep.education.phd") },
    { value: "any", label: tj("salaryStep.education.any") },
  ];

  // Experience options
  const experienceOptions = [
    { value: "0", label: tj("salaryStep.experience.fresher") },
    { value: "1", label: tj("salaryStep.experience.one") },
    { value: "2", label: tj("salaryStep.experience.two") },
    { value: "3", label: tj("salaryStep.experience.three") },
    { value: "5", label: tj("salaryStep.experience.fivePlus") },
    { value: "10", label: tj("salaryStep.experience.tenPlus") },
  ];

  // Gender preference options
  const genderPreferenceOptions = [
    { value: "lgbtq", label: tv("genderPreferenceOptions.lgbtq") },
    { value: "nonlgbtq", label: tv("genderPreferenceOptions.nonlgbtq") },
    { value: "all", label: tv("genderPreferenceOptions.all") },
  ];

  useEffect(() => {
    if (!isOpen) {
      setEditMode(false);
      setFormData({});
      resetLocation();
    } else {
      // Set edit mode based on prop when modal opens
      setEditMode(isEditMode);
    }
  }, [isOpen, isEditMode, resetLocation]);

  // Check if location is complete
  useEffect(() => {
    if (formData.jobLocation) {
      const parts = formData.jobLocation.split(",").map((part) => part.trim());
      setLocationComplete(parts.length >= 1 && parts[0]);
    } else {
      setLocationComplete(false);
    }
  }, [formData.jobLocation]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSelectChange = useCallback((e) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  }, [handleInputChange]);

  const handleLocationChange = useCallback(
    (val) => {
      if (val) {
        handleInputChange("jobLocation", val);
        const parts = val.split(",").map((part) => part.trim());
        if (parts.length >= 1 && parts[0]) {
          setLocationComplete(true);
        } else {
          setLocationComplete(false);
        }
      }
    },
    [handleInputChange]
  );

  const toggleRemote = useCallback(() => {
    setFormData((prev) => {
      const newIsRemote = !prev.isRemote;
      return {
        ...prev,
        isRemote: newIsRemote,
        jobLocation: newIsRemote ? "" : prev.jobLocation,
        area: newIsRemote ? "" : prev.area,
      };
    });
    setLocationComplete(false);
    resetLocation();
  }, [resetLocation]);

  // Helper function to strip HTML tags
  const stripHtmlTags = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleSkillsChange = useCallback((skills) => {
    handleInputChange("requiredSkills", skills);
  }, [handleInputChange]);

  // Sync SkillsInput when formData.requiredSkills changes externally
  const [skillsInputKey, setSkillsInputKey] = useState(0);
  useEffect(() => {
    if (editMode) {
      setSkillsInputKey(prev => prev + 1);
    }
  }, [editMode, formData.requiredSkills]);

  useEffect(() => {
    if (jobData?.data && editMode) {
      const job = jobData.data;
      // Parse work hours if it's in "HH:MM - HH:MM" format
      let workHoursFrom = "";
      let workHoursTo = "";
      if (job.workHours && job.workHours.includes(" - ")) {
        const [from, to] = job.workHours.split(" - ");
        workHoursFrom = from.trim();
        workHoursTo = to.trim();
      }

      // Check if job is remote
      const isRemote = job.jobLocation === "Remote" || job.jobLocation === "remote";

      setFormData({
        jobTitle: job.jobTitle || "",
        jobType: job.employeeType || "",
        employeeType: job.employeeType || "",
        department: job.department || "",
        jobLocation: isRemote ? "" : (job.jobLocation || ""),
        area: job.area || "",
        isRemote: isRemote,
        description: stripHtmlTags(job.description || ""),
        seniorityLevel: job.seniorityLevel || "",
        salaryRange: job.salaryRange || "",
        workHoursFrom: workHoursFrom,
        workHoursTo: workHoursTo,
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "",
        genderPreference: job.genderPrefereance || "",
        genderPrefereance: job.genderPrefereance || "",
        careerWebsite: job.careerWebsite || "",
        contactNumber: job.contactNumber || "",
        applyVia: job.applyVia || "",
        education: job.education || "",
        responsibilities: stripHtmlTags(job.responsibilities || ""),
        requiredSkills: job.requiredSkills || [],
        experience: job.experience || "",
        status: job.status !== undefined ? job.status : 0,
        requiredLanguages: Array.isArray(job.requiredLanguages) ? job.requiredLanguages : [],
      });
    }
  }, [jobData, editMode]);

  if (isLoading) {
    return (
      <Modal open={isOpen} onClose={onClose} size="md">
        <Modal.Header>
          <Modal.Title className="text-lg sm:text-xl">{tv("loading")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="py-6 sm:py-8 text-center">
            <div className="mx-auto h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">{tv("loadingJobDetails")}</p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal open={isOpen} onClose={onClose} size="md">
        <Modal.Header>
          <Modal.Title className="text-lg sm:text-xl">{tv("error")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="py-6 sm:py-8 text-center">
            <p className="text-sm sm:text-base text-red-600">{error?.message || tv("failedToLoadJobDetails")}</p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  if (!jobData?.data) {
    return (
      <Modal open={isOpen} onClose={onClose} size="md">
        <Modal.Header>
          <Modal.Title className="text-lg sm:text-xl">{tv("jobNotFound")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="py-6 sm:py-8 text-center">
            <p className="text-sm sm:text-base text-gray-600">{tv("jobDetailsNotFound")}</p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  const job = jobData.data;

  // Helper function to check if a field has a valid value
  const hasValue = (value) => {
    return value && value !== "Not specified" && value.trim() !== "";
  };

  const handleSave = () => {
    const updateData = {
      jobTitle: formData.jobTitle,
      employeeType: formData.jobType || formData.employeeType,
      department: formData.department,
      jobLocation: formData.isRemote ? "Remote" : formData.jobLocation,
      area: formData.area,
      description: formData.description,
      seniorityLevel: formData.seniorityLevel,
      salaryRange: formData.salaryRange,
      workHours: formData.workHoursFrom && formData.workHoursTo
        ? `${formData.workHoursFrom} - ${formData.workHoursTo}`
        : job.workHours,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : job.deadline,
      genderPrefereance: formData.genderPreference || formData.genderPrefereance,
      careerWebsite: formData.careerWebsite,
      contactNumber: formData.contactNumber,
      applyVia: formData.applyVia,
      education: formData.education,
      responsibilities: formData.responsibilities,
      requiredSkills: formData.requiredSkills,
      experience: formData.experience,
      status: formData.status,
      requiredLanguages: Array.isArray(formData.requiredLanguages)
        ? formData.requiredLanguages
        : job.requiredLanguages || [],
    };

    updateJob(
      { jobId, data: updateData },
      {
        onSuccess: () => {
          setEditMode(false);
          refetch();
        },
      }
    );
  };

  // Helper function to render a field only if it has a value
  const renderField = (label, value) => {
    if (!hasValue(value)) return null;
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 py-2 last:border-b-0 gap-1 sm:gap-0">
        <span className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">{label}</span>
        <span className="text-xs sm:text-sm font-medium text-gray-900 break-words leading-relaxed">{value}</span>
      </div>
    );
  };

  // Helper function to render a date field
  const renderDateField = (label, dateValue) => {
    if (!dateValue) return null;
    const formattedDate = new Date(dateValue).toLocaleDateString();
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 py-2 last:border-b-0 gap-1 sm:gap-0">
        <span className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">{label}</span>
        <span className="text-xs sm:text-sm font-medium text-gray-900 leading-relaxed break-words">{formattedDate}</span>
      </div>
    );
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="lg" className="max-w-[95vw] sm:max-w-4xl">
      <Modal.Header>
        <Modal.Title className="text-lg sm:text-xl lg:text-2xl">
          {editMode ? tv("editJob") : tv("jobDetails")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Job Header */}
          <div className=" pb-3 sm:pb-4">
            {editMode ? (
              <div className="space-y-4">
                <InputField
                  label={t("JobTitle")}
                  name="jobTitle"
                  value={formData.jobTitle || ""}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  placeholder={t("EnterJobTitle")}
                />

                <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
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
                    <div className="space-y-1 mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">{t("JobLocation")}</label>
                      <SimpleLocationSelector
                        value={formData.jobLocation}
                        onChange={handleLocationChange}
                      />
                    </div>
                    <InputField
                      name="jobArea"
                      label={t("fulladdress")}
                      value={formData.area || ""}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      placeholder={t("EnterJobArea")}
                    />
                  </>
                )}
              </div>
            ) : (
              <>
                <h2 className="mb-2 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">{job.jobTitle}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  {hasValue(job.jobLocation) && <span className="leading-relaxed break-words">📍 {job.jobLocation}</span>}
                  {hasValue(job.contactEmail) && <span className="leading-relaxed break-all">✉️ {job.contactEmail}</span>}
                </div>
              </>
            )}
          </div>

          {/* Job Information */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold text-gray-900">{tv("jobInformation")}</h3>
              <div className="space-y-3 rounded bg-[#fcfcfd] p-3 sm:p-4">
                {editMode ? (
                  <>
                    <Selecter
                      name="jobType"
                      label={t("EmploymentType")}
                      placeholder={t("SelectEmploymentType")}
                      value={formData.jobType || formData.employeeType || ""}
                      onChange={handleSelectChange}
                      options={employetypeOptions}
                    />
                    <Selecter
                      name="department"
                      label={t("Department")}
                      placeholder={t("SelectDepartment")}
                      value={formData.department || ""}
                      onChange={handleSelectChange}
                      options={departmentOptions}
                    />
                    <Selecter
                      name="seniorityLevel"
                      label={tj("requirementsStep.seniorityTitle")}
                      placeholder={tv("selectSeniorityLevel")}
                      value={formData.seniorityLevel || ""}
                      onChange={handleSelectChange}
                      options={seniorityOptions}
                    />
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{tv("workHours")}</label>
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={formData.workHoursFrom || ""}
                          onChange={(e) => handleInputChange("workHoursFrom", e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="self-center text-gray-500">-</span>
                        <input
                          type="time"
                          value={formData.workHoursTo || ""}
                          onChange={(e) => handleInputChange("workHoursTo", e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {renderField(tv("employmentType"), job.employeeType)}
                    {renderField(tv("department"), job.department)}
                    {renderField(tv("seniorityLevel"), job.seniorityLevel)}
                    {renderField(tv("workHours"), job.workHours)}
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold text-gray-900">{tv("compensationTimeline")}</h3>
              <div className="space-y-3 rounded bg-[#fcfcfd] p-3 sm:p-4">
                {editMode ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{tv("salaryRange")}</label>
                      <input
                        type="text"
                        value={formData.salaryRange || ""}
                        onChange={(e) => handleInputChange("salaryRange", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {renderDateField(tv("postedDate"), job.createdAt)}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{tv("deadline")}</label>
                      <input
                        type="date"
                        value={formData.deadline || ""}
                        onChange={(e) => handleInputChange("deadline", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {renderField(tv("salaryRange"), job.salaryRange)}
                    {renderDateField(tv("postedDate"), job.createdAt)}
                    {renderDateField(tv("deadline"), job.deadline)}
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold text-gray-900">{tv("contactInformation")}</h3>
              <div className="space-y-3 rounded bg-[#fcfcfd] p-3 sm:p-4">
                {editMode ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{tv("ContactNumber")}</label>
                      <input
                        type="tel"
                        value={formData.contactNumber || ""}
                        onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={tv("enterContactNumber")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{tv("Apply")}</label>
                      <input
                        type="email"
                        value={formData.applyVia || ""}
                        onChange={(e) => handleInputChange("applyVia", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={tv("enterEmailForApplications")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{tv("careerWebsite")}</label>
                      <input
                        type="text"
                        value={formData.careerWebsite || ""}
                        onChange={(e) => handleInputChange("careerWebsite", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={tv("enterCareerWebsiteUrl")}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {renderField(tv("contactNumber"), job.contactNumber)}
                    {renderField(tv("applyVia"), job.applyVia)}
                    {renderField(tv("careerWebsite"), job.careerWebsite)}
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold text-gray-900">{tv("requirements")}</h3>
              <div className="space-y-3 rounded bg-[#fcfcfd] p-3 sm:p-4">
                {editMode ? (
                  <>
                    <Selecter
                      name="education"
                      label={tj("salaryStep.educationLabel")}
                      placeholder={tv("selectEducation")}
                      value={formData.education || ""}
                      onChange={handleSelectChange}
                      options={educationOptions}
                    />
                    <Selecter
                      name="experience"
                      label={tj("salaryStep.experienceLabel")}
                      placeholder={tj("salaryStep.experiencePlaceholder")}
                      value={formData.experience || ""}
                      onChange={handleSelectChange}
                      options={experienceOptions}
                    />
                    <Selecter
                      name="genderPreference"
                      label={tv("genderPreference")}
                      placeholder={tv("selectGenderPreference")}
                      value={formData.genderPreference || formData.genderPrefereance || ""}
                      onChange={handleSelectChange}
                      options={genderPreferenceOptions}
                    />
                  </>
                ) : (
                  <>
                    {renderField(tv("education"), job.education)}
                    {renderField(tv("experience"), job.experience)}
                    {renderField(tv("genderPreference"), job.genderPrefereance)}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          {(hasValue(job.description) || editMode) && (
            <div>
              <h3 className="mb-2 text-sm sm:text-base font-semibold text-gray-900">{tv("jobDescription")}</h3>
              <div className="rounded bg-[#fcfcfd] p-3 sm:p-4">
                {editMode ? (
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={6}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={tv("enterJobDescription")}
                  />
                ) : (
                  <div className="text-xs sm:text-sm break-words leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {(hasValue(job.responsibilities) || editMode) && (
            <div>
              <h3 className="mb-2 text-sm sm:text-base font-semibold text-gray-900">{tv("responsibilities")}</h3>
              <div className="rounded bg-[#fcfcfd] p-3 sm:p-4">
                {editMode ? (
                  <textarea
                    value={formData.responsibilities || ""}
                    onChange={(e) => handleInputChange("responsibilities", e.target.value)}
                    rows={6}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={tv("enterResponsibilities")}
                  />
                ) : (
                  <div className="text-xs sm:text-sm break-words leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills and Tags */}
          <div className="grid grid-cols-1">
            {((job.requiredSkills && job.requiredSkills.length > 0) || editMode) && (
              <div>
                <h3 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold text-gray-900">{tv("requiredSkills")}</h3>
                <div className="rounded bg-[#fcfcfd] p-3 sm:p-4">
                  {editMode ? (
                    <SkillsInput
                      key={skillsInputKey}
                      onSkillsChange={handleSkillsChange}
                      initialSkills={Array.isArray(formData.requiredSkills) ? formData.requiredSkills : []}
                      placeholder={tv("enterSkill")}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {job.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded bg-blue-100 px-2 py-1 text-xs sm:text-sm text-blue-800 break-words leading-relaxed"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {job.jobTags && job.jobTags.length > 0 && (
              <div>
                <h3 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold text-gray-900">{tv("jobTags")}</h3>
                <div className="rounded bg-[#fcfcfd] p-3 sm:p-4">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {job.jobTags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded bg-green-100 px-2 py-1 text-xs sm:text-sm text-green-800 break-words leading-relaxed"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {((job.requiredLanguages && job.requiredLanguages.length > 0) || editMode) && (
              <div className="md:col-span-2 lg:col-span-1">
                <h3 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold text-gray-900">{tv("requiredLanguages")}</h3>
                <div className="rounded bg-[#fcfcfd] p-3 sm:p-4">
                  {editMode ? (
                    <Selecter
                      name="requiredLanguages"
                      label={tv("requiredLanguages")}
                      placeholder={tv("selectRequiredLanguages")}
                      value={
                        Array.isArray(formData.requiredLanguages)
                          ? formData.requiredLanguages
                          : []
                      }
                      onChange={handleSelectChange}
                      options={languageOptions}
                      isMulti={true}
                      isSearchable={true}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {job.requiredLanguages?.map((language, index) => (
                        <span
                          key={index}
                          className="rounded bg-purple-100 px-2 py-1 text-xs sm:text-sm text-purple-800 break-words"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-2 justify-end w-full">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                disabled={isUpdating}
                className="rounded bg-gray-500 px-4 py-2 text-sm sm:text-base text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tv("cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="rounded bg-blue-600 px-4 py-2 text-sm sm:text-base text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    {tv("saving")}
                  </>
                ) : (
                  tv("saveChanges")
                )}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="rounded bg-gray-500 px-4 py-2 text-sm sm:text-base text-white hover:bg-gray-600 transition-colors"
            >
              {tv("close")}
            </button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewJobModal;
