"use client";
import { useScheduleInterview } from "@/hooks/interview/useScheduleInterview";
import { useUpdateInterview } from "@/hooks/interview/useUpdateInterview";
import useInterviewValidation from "@/hooks/validation/company/useInterviewValidation";
import getImg from "@/lib/getImg";
import { useTimeZonesOptions } from "@/utils/selectOptions";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DatePicker, Input, Modal, SelectPicker } from "rsuite";

const SetInterviewModal = ({
  isOpen,
  onClose,
  jobId,
  candidateData,
  interviewId,
  jobData,
  isReschedule = false,
  onInterviewScheduled,
}) => {
 // console.log(jobData, "jobData-----------------");
  const isRemote = jobData?.jobLocation?.includes("Remote");
 // console.log(isRemote, "isRemote-----------------");
 // console.log(candidateData, "candidateData-----------------");
 // console.log("Is remote job detected:", isRemote);
 // console.log("Job location:", jobData?.jobLocation);

  const t = useTranslations("SetInterviewModal");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [address, setAddress] = useState("");
  const [onlineLink, setOnlineLink] = useState("");
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [isLoadingViewResume, setIsLoadingViewResume] = useState(false);
  const timeZones = useTimeZonesOptions();


  const { errors, validateField, validateForm } = useInterviewValidation();
  const { mutate: scheduleInterview, isLoading: isScheduleLoading } = useScheduleInterview(() => {
    try {
      onInterviewScheduled?.();
    } finally {
      onClose?.();
    }
  });
  const { mutate: updateInterview, isLoading: isUpdateLoading } = useUpdateInterview(() => {
    try {
      onInterviewScheduled?.();
    } finally {
      onClose?.();
    }
  });

  const isLoading = isScheduleLoading || isUpdateLoading;

 // console.log("Loading states:", { isScheduleLoading, isUpdateLoading, isLoading });

  // Helper function to format date correctly without timezone issues
  const formatDateForAPI = (selectedDate) => {
    if (!selectedDate) return null;

    // Create a new date object and set it to the selected date at noon to avoid timezone issues
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    // Create date at noon in local timezone to avoid date shifting
    const localDate = new Date(year, month, day, 12, 0, 0, 0);

    // Format as YYYY-MM-DD
    const formattedDate = localDate.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format

    return formattedDate;
  };

  const handleSend = () => {
    const formData = { date, startTime, address, timeZone, onlineLink };
   // console.log("Form data being validated:", formData);
   // console.log("Is remote job:", isRemote);

    if (validateForm(formData, isRemote)) {
      if (isReschedule && interviewId) {
        // Update existing interview for reschedule
        const updateData = {
          date: formatDateForAPI(date),
          startTime,
          interviewAddress: isRemote ? onlineLink : address,
          timezone: timeZone,
          onlineLink: isRemote ? onlineLink : undefined,
        };
       // console.log("Updating interview with:", updateData);
        updateInterview({ interviewId, data: updateData });
      } else {
        // Create new interview - only send required fields
        const newInterviewData = {
          companyId: Cookies.get("userId"),
          userId: candidateData?.userId,
          jobId,
          date: formatDateForAPI(date),
          startTime,
          interviewAddress: isRemote ? onlineLink : address,
          timeZone: timeZone,
          onlineLink: isRemote ? onlineLink : undefined,
        };
       // console.log("Creating new interview with:", newInterviewData);
        scheduleInterview(newInterviewData);
      }
    } else {
     // console.log("Form validation failed. Errors:", errors);
    }
  };

  // Resume view logic (like ResumeTab)
  let fileName, fileUrl, fileExtension;
  if (typeof candidateData?.resume === "string") {
    fileName = candidateData.resume.split("/").pop();
    fileUrl = getImg(candidateData.resume);
    fileExtension = fileName.split(".").pop()?.toLowerCase();
  }

  // Function to get Google Docs viewer URL
  const getGoogleDocsViewerUrl = (url) => {
    let absoluteUrl = url;
    if (!url.startsWith("http")) {
      const baseUrl = window.location.origin;
      absoluteUrl = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=false`;
  };

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

  useEffect(() => {
    if (isOpen) {
      setDate(null);
      setStartTime("");
      setAddress("");
      setOnlineLink("");
      setTimeZone("Asia/Kolkata");
    }
  }, [isOpen]);

 // console.log(candidateData, "candidateData");
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="sm"
      className="!max-h-[90vh] !w-[95%] overflow-hidden !p-0 sm:!max-h-[85vh] sm:!w-[90%] md:!w-[547px] bg-white"
    >
      <Modal.Header className="bg-white">
        <div className="mb-2 border-b border-slate-300 py-2">
          <div className="my-1 text-[20px] font-bold text-gray-900">
            {candidateData?.userId?.profile
              ?.fullName
              || candidateData?.originalData?.userId?.profile
                ?.fullName}
          </div>
          <div className="my-1 text-[14px] font-medium text-gray-700">{candidateData?.userId?.preferences?.jobRole || candidateData?.originalData
            ?.userId?.preferences?.jobRole || "Unknown Role"}</div>
          <div className="text-[13px] text-[#007BFF]">{candidateData?.userId?.email || candidateData?.originalData?.userId?.email}</div>
          <div className="mb-2 text-[#888DA8]">
            {candidateData?.userId?.preferences?.yearsOfExperience
              ? t("experienceYears", { years: candidateData?.userId?.preferences?.yearsOfExperience })
              : t("experienceYears", { years: candidateData?.originalData?.userId?.preferences?.yearsOfExperience })
            }
          </div>
          {candidateData?.resume && (
            <div className="text-sm text-blue-600">
              <button
                type="button"
                onClick={handleView}
                disabled={isLoadingViewResume}
                className="underline disabled:opacity-50"
              >
                {isLoadingViewResume ? t("opening") : t("viewResume")}
              </button>
            </div>
          )}
        </div>
      </Modal.Header>

      <Modal.Body className="no-scrollbar h-full overflow-y-auto rounded-lg bg-white !p-1 sm:p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="font-semibold text-gray-900">{t("date")}*</label>
              <DatePicker
                oneTap
                value={date}
                onChange={(value) => {
                  setDate(value);
                  validateField("date", value, isRemote);
                }}
                placeholder={t("selectDate")}
                shouldDisableDate={(d) => d < new Date().setHours(0, 0, 0, 0)}
                className="mt-1 w-full"
                format="yyyy-MM-dd"
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="flex-1">
              <label className="font-semibold text-gray-900">{t("startTime")}*</label>
              <Input
                type="time"
                value={startTime}
                onChange={(value) => {
                  setStartTime(value);
                  validateField("startTime", value, isRemote);
                }}
                placeholder={t("startTime")}
                className="mt-1 w-full"
              />
              {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="font-semibold text-gray-900">{t("timeZone")}*</label>
              <SelectPicker
                data={timeZones}
                value={timeZone}
                onChange={(value) => {
                  setTimeZone(value);
                  validateField("timeZone", value, isRemote);
                }}
                placeholder={t("timeZone")}
                className="mt-1 w-full"
                searchable={false}
                defaultValue="Asia/Kolkata"
              />
              {errors.timeZone && <p className="text-sm text-red-500">{errors.timeZone}</p>}
            </div>
          </div>

          {!isRemote && (
            <div className="w-full">
              <label className="font-semibold text-gray-900">{t("interviewAddress")}*</label>
              <Input
                as="textarea"
                value={address}
                onChange={(value) => {
                  setAddress(value);
                  validateField("address", value, isRemote);
                }}
                placeholder={t("interviewAddress")}
                className="mt-1 w-full"
                rows={4}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>
          )}
          {
            isRemote && (
              <div className="w-full">
                <label className="font-semibold text-gray-900">{t("interviewLink")}*</label>
                <Input
                  value={onlineLink}
                  onChange={(value) => {
                    setOnlineLink(value);
                    validateField("onlineLink", value, isRemote);
                  }}
                  placeholder={t("interviewLink")}
                  className="mt-1 w-full"
                />
                {errors.onlineLink && <p className="text-sm text-red-500">{errors.onlineLink}</p>}
              </div>
            )
          }
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-white">
        <div className="my-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-primary border-primary rounded border px-4 py-1.5 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("close")}
          </button>
          <button
            onClick={() => {
             // console.log("🎯 Button clicked!");
              handleSend();
            }}
            disabled={isLoading}
            className="bg-primary hover:text-primary hover:border-primary rounded-sm px-6 py-2 text-[13px] text-white hover:border hover:bg-white"
          >
            {isLoading
              ? isReschedule
                ? t("rescheduling")
                : t("scheduling")
              : isReschedule
                ? t("rescheduleInterview")
                : t("sendInterview")}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SetInterviewModal;


