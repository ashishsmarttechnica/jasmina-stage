import ViewJobModal from "@/modal/ViewJobModal";
import { getStatusColor, getStatusText } from "@/utils/singleApplicationUtils";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

const ApplicantList = ({ applicants, selectedApplicant, handleApplicantClick }) => {
  const [moreOptionsDropdownId, setMoreOptionsDropdownId] = useState(null);
  const moreOptionsRefs = useRef({});
  const t = useTranslations("Applications");

  // State for view job modal
  const [viewJobModalOpen, setViewJobModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const handleMoreOptionsClick = (e, applicantId) => {
    e.stopPropagation();
    setMoreOptionsDropdownId(moreOptionsDropdownId === applicantId ? null : applicantId);
  };

  const handleCloseMoreOptions = () => {
    setMoreOptionsDropdownId(null);
  };

  const handleViewJob = (jobId) => {
    setSelectedJobId(jobId);
    setViewJobModalOpen(true);
    setMoreOptionsDropdownId(null); // Close dropdown
  };

  const closeViewJobModal = () => {
    setViewJobModalOpen(false);
    setSelectedJobId(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideMoreOptionsDropdowns = Object.values(moreOptionsRefs.current).every(
        (ref) => !ref || !ref.contains(event.target)
      );

      if (isOutsideMoreOptionsDropdowns && moreOptionsDropdownId) {
        setMoreOptionsDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moreOptionsDropdownId]);

  if (!applicants || applicants.length === 0) {
    return (
      <div className="w-full rounded-lg bg-white p-4 text-center shadow-md sm:p-6 lg:w-[40%]">
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className="h-12 w-12 text-gray-400 sm:h-16 sm:w-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 48 48"
          >
            <path
              d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M24 12v12M24 32h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm text-gray-500 sm:text-base">{t("noApplicants")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg bg-white shadow-md lg:w-[40%]">
      {applicants.map((applicant) => {
        // Use the utility function to get status text (English) for color logic
        const rawStatusText = getStatusText(applicant.status);
        const statusText = rawStatusText === "Approved" ? "Reviewed" : rawStatusText;
        const statusKeyMap = {
          1: "new",
          2: "interviewing",
          3: "reviewed",
          4: "rejected",
          5: "hired",
          6: "reviewed",
        };
        const translatedStatus = t(`statusLabels.${statusKeyMap[parseInt(applicant.status)] || "new"}`);

        // Debug the applicant data
       // console.log("Applicant Status:", applicant.status, "Status Text:", statusText);

        return (
          <div
            key={applicant._id || applicant.id}
            className={`flex cursor-pointer flex-col gap-3 border-b border-gray-100 p-4 transition-colors duration-150 hover:bg-gray-100 sm:flex-row sm:items-center sm:justify-between ${selectedApplicant?._id === applicant._id
              ? "border-l-4 border-[#0a66c2] bg-[#e7f3ff]"
              : ""
              }`}
            onClick={() => {
              handleApplicantClick(applicant);
            }}
          >
            {/* Applicant Info - Responsive */}
            <div className="flex-1 min-w-0">
              <h3
                className={`text-[14px] font-medium text-[#1B1B1B] sm:text-[15px] ${selectedApplicant?._id === applicant._id ? "font-bold text-[#0a66c2]" : ""
                  }`}
              >
                {applicant.name || t("common.unknown")}
              </h3>
              <p className="text-[12px] text-gray-500 sm:text-sm">
                {applicant.location || "No location"}
              </p>
            </div>

            {/* Status and Actions - Responsive */}
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getStatusColor(statusText)}`}>
                  {translatedStatus}
                </span>
              </div>

              {/* More Options Button - Responsive */}
              <div className="relative" ref={(el) => (moreOptionsRefs.current[applicant._id] = el)}>
                <button
                  onClick={(e) => handleMoreOptionsClick(e, applicant._id)}
                  className="p-1 text-gray-500 transition-colors hover:text-black"
                >
                  <FiMoreVertical
                    size={20}
                    className="rounded-md bg-[#F2F2F2] p-1 text-[#000] sm:size-[25px]"
                  />
                </button>

                {/* More Options Dropdown */}
                {/* {moreOptionsDropdownId === applicant._id && (
                  <div className="absolute top-full right-0 z-20 mt-1 min-w-[140px] rounded-md border border-gray-200 bg-white shadow-lg">
                    <button
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   handleViewJob(applicant.jobId);
                      // }}
                      className="flex w-full items-center px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {t("viewJob")}
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        );
      })}

      <ViewJobModal isOpen={viewJobModalOpen} onClose={closeViewJobModal} jobId={selectedJobId} />
    </div>
  );
};

export default ApplicantList;
