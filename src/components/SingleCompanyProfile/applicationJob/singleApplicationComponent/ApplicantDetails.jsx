import { updateApplicationStatus } from "@/api/job.api";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaDownload,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperclip,
  FaPhone,
} from "react-icons/fa";
import { toast } from "react-toastify";
import getImg from "../../../../lib/getImg";

// Convert numeric status to readable text
const getStatusText = (status) => {
  const numericStatus = parseInt(status);
  switch (numericStatus) {
    case 1:
      return "New";
    case 2:
      return "Interviewing";
    case 3:
      return "Approved";
    case 4:
      return "Rejected";
    case 5:
      return "Hired";
    case 6:
      return "Reviewed";
    default:
      return "New";
  }
};

const ApplicantDetails = ({
  selectedApplicant,
  setIsSetInterviewOpen,
  applicants,
  onStatusChange,
  jobData
}) => {
 // console.log(jobData?.jobLocation, "jobDatajobDatajobData");
  const remote = jobData?.jobLocation?.includes("Remote");
  const t = useTranslations("Applications");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingViewResume, setIsLoadingViewResume] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const queryClient = useQueryClient();
  const resume = selectedApplicant?.resume || selectedApplicant?.appliedCV;

 // console.log(applicants, "applicantsData___________________");

  // Update current status when selectedApplicant changes
  useEffect(() => {
    if (selectedApplicant) {
      const status = selectedApplicant.originalData?.status || selectedApplicant.status;
      setCurrentStatus(parseInt(status) || 1);
    }
  }, [selectedApplicant]);

  useEffect(() => {
    if (resume) {
      setResumeUrl(resume);
    }
  }, [resume]);

  if (!selectedApplicant) return null;

  const isInterviewFixed = currentStatus === 2;

  const getGoogleDocsViewerUrl = (url) => {
    let absoluteUrl = url;
    if (!url.startsWith("http")) {
      const baseUrl = window.location.origin;
      absoluteUrl = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=false`;
  };

  let fileName, fileUrl, fileExtension;
  if (typeof resume === "string") {
    fileName = resume.split("/").pop();
    fileUrl = getImg(resume);
    fileExtension = fileName.split(".").pop()?.toLowerCase();
  }

  const handleView = () => {
    if (!fileUrl) return;
    setIsLoadingViewResume(true);
    try {
      const viewerUrl = getGoogleDocsViewerUrl(fileUrl);
      window.open(viewerUrl, "_blank");
    } catch (error) {
      console.error("Error opening document:", error);
      window.open(fileUrl, "_blank");
    } finally {
      setIsLoadingViewResume(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = parseInt(e.target.value);

    // If selecting Interviewing, open modal instead of immediate update
    if (newStatus === 2) {
      // Revert select to previous value and open modal
      const previousStatus = selectedApplicant.originalData?.status || selectedApplicant.status || 1;
      setCurrentStatus(parseInt(previousStatus));
      setIsSetInterviewOpen(true);
      return;
    }

    setIsUpdating(true);

    try {
      await updateApplicationStatus({
        userId: selectedApplicant.userId,
        jobId: selectedApplicant.jobId,
        status: newStatus,
      });
      queryClient.invalidateQueries(["applicants"]);
      setCurrentStatus(newStatus);
      toast.success("Status updated successfully");
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      const previousStatus = selectedApplicant.originalData?.status || selectedApplicant.status || 1;
      setCurrentStatus(parseInt(previousStatus));
      onStatusChange?.(previousStatus);
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPreferredStartDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
 // console.log(selectedApplicant, "selectedApplicantselectedApplicant");
  return (
    <div className="w-full lg:w-[60%]">
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Header Section - Responsive */}
        <div className="border-b border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h2 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">
                {selectedApplicant?.fullName
                  ? selectedApplicant.fullName.charAt(0).toUpperCase() +
                  selectedApplicant.fullName.slice(1)
                  : selectedApplicant?.name ||
                  selectedApplicant?.userName?.charAt(0).toUpperCase() +
                  selectedApplicant?.userName?.slice(1) ||
                  t("common.unknown")}
              </h2>

              {/* Contact Info - Responsive */}
              <div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:gap-4">
                {selectedApplicant.email && (
                  <div className="flex items-center gap-2 min-w-0 max-w-full break-all">
                    <FaEnvelope className="text-blue-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm leading-relaxed break-all">
                      {selectedApplicant.email}
                    </span>
                  </div>
                )}

                {selectedApplicant.phone && (
                  <div className="flex items-center gap-2 min-w-0 max-w-full break-all">
                    <FaPhone className="text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm leading-relaxed break-all">{selectedApplicant.phone}</span>
                  </div>
                )}

                {selectedApplicant.location && (
                  <div className="flex items-center gap-2 min-w-0 max-w-full break-words">
                    <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm leading-relaxed break-words">{selectedApplicant.location}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Status and Actions - Responsive */}
            <div className="flex flex-col gap-3 sm:items-end">
              <select
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:w-auto sm:px-4"
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={isUpdating}
              >
                <option value={1}>{t("statusLabels.new")}</option>
                <option value={2}>{t("statusLabels.interviewing")}</option>
                <option value={4}>{t("statusLabels.rejected")}</option>
                <option value={5}>{t("statusLabels.hired")}</option>
                <option value={6}>{t("statusLabels.reviewed")}</option>
              </select>

              {/* <button
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:w-auto sm:px-4 ${isInterviewFixed
                  ? "cursor-not-allowed bg-gray-100 text-gray-500"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                onClick={() => {
                  if (!isInterviewFixed) {
                    setIsSetInterviewOpen(true);
                  }
                }}
                disabled={isInterviewFixed}
              >
                <FaCalendarCheck />
                <span className="text-xs sm:text-sm">
                  {isInterviewFixed ? t("interviewFixed") : t("setInterview")}
                </span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Resume Section - Responsive */}
        {resume && (
          <div className="border-b border-gray-100 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{t("resumeSection.title")}</h3>
                <p className="text-xs text-gray-600 sm:text-sm">{fileName}</p>
              </div>
              <button
                onClick={handleView}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto sm:px-4"
              >
                <FaDownload />
                <span className="text-xs sm:text-sm">{t("resumeSection.view")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Attachments Section - Responsive */}
        {selectedApplicant.originalData?.attechments &&
          selectedApplicant.originalData?.attechments.length > 0 && (
            <div className="border-b border-gray-100 p-4">
              <h3 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg">{t("attachments.title")}</h3>

              <div className="space-y-2">
                {selectedApplicant.originalData.attechments.map((attachment, index) => {
                  const fileName =
                    typeof attachment === "string"
                      ? attachment.split("/").pop()
                      : attachment.url?.split("/").pop() || "Attachment";

                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <FaPaperclip className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-700 sm:text-sm">{fileName}</span>
                      </div>
                      <button
                        onClick={() => {
                          const fileUrl =
                            typeof attachment === "string"
                              ? getImg(attachment)
                              : getImg(attachment.url);
                          window.open(fileUrl, "_blank");
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 sm:w-auto"
                      >
                        <FaDownload />
                        {t("attachments.view")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Application Details - Responsive */}
        <div className="border-b border-gray-100 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:text-base">{t("applicationDetails.title")}</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Personal Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                {t("applicationDetails.personalInfo")}
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50">
                    <FaEnvelope className="text-xs text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 sm:text-sm leading-relaxed break-words whitespace-pre-line ">{t("applicationDetails.email")}</p>
                    {/* <div className="flex items-center gap-2 min-w-0 max-w-full break-all"> */}
                    {/* <FaEnvelope className="text-blue-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm leading-relaxed break-all">
                      {selectedApplicant.email}
                    </span> */}
                    <p className="text-xs font-medium text-gray-900 sm:text-sm leading-relaxed break-all">
                      {selectedApplicant.email || t("common.notProvided")}
                    </p>
                    {/* </div> */}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50">
                    <span className="text-xs font-bold text-indigo-600">$</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 leading-relaxed break-words">{t("applicationDetails.salary")}</p>
                    <p className="text-xs font-medium text-gray-900 sm:text-sm leading-relaxed break-all">
                      {selectedApplicant.originalData?.salaryExpectation || t("common.notSpecified")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                {t("applicationDetails.applicationInfo")}
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-50">
                    <FaCalendarCheck className="text-xs text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 leading-relaxed break-words">{t("applicationDetails.startDate")}</p>
                    <p className="text-xs font-medium text-gray-900 sm:text-sm leading-relaxed break-words">
                      {selectedApplicant.originalData?.preferredStartDate
                        ? formatPreferredStartDate(
                          selectedApplicant.originalData.preferredStartDate
                        )
                        : t("common.notSpecified")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-50">
                    <FaCalendarCheck className="text-xs text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 leading-relaxed break-words">{t("applicationDetails.availability")}</p>
                    <p className="text-xs font-medium text-gray-900 sm:text-sm leading-relaxed break-words">
                      {selectedApplicant.originalData?.currentAvailability || t("common.notSpecified")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Section - Responsive */}
          {selectedApplicant.originalData?.message && (
            <div className="mt-4">
              <div className="leading-relaxed job-description text-gray-700">
                <div className="w-full text-xs font-medium text-gray-500 uppercase mb-2 leading-relaxed break-words">
                  {t("applicationDetails.coverMessage")}
                </div>
              </div>
              <div className="rounded  p-3">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words whitespace-pre-line">
                  {selectedApplicant.originalData.message}
                </p>
              </div>
            </div>
          )}
          {selectedApplicant.originalData?.notes && (
            <div className="mt-4">
              <div className="leading-relaxed job-description text-gray-700">
                <div className="w-full text-xs font-medium text-gray-500 uppercase mb-2 leading-relaxed break-words">
                  {t("Notes")}
                </div>
              </div>
              <div className="rounded  p-3">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words whitespace-pre-line">
                  {selectedApplicant.originalData.notes}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
