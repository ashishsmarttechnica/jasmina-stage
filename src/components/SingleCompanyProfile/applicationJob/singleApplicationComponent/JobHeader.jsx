import { formatDate } from "@/utils/singleApplicationUtils";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FaEye } from "react-icons/fa6";
import { FiMoreVertical } from "react-icons/fi";
import ViewJobModal from "../../../../modal/ViewJobModal";

const JobHeader = ({ jobData }) => {
  // console.log(jobData, "jobData++++++++++||||||||||||||||");
  const [moreOptionsDropdownId, setMoreOptionsDropdownId] = useState(null);
  const moreOptionsRefs = useRef({});
  const t = useTranslations("Applications");

  const handleMoreOptionsClick = (e, jobId) => {
    e.stopPropagation();
    setMoreOptionsDropdownId(moreOptionsDropdownId === jobId ? null : jobId);
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

  const [viewJobModalOpen, setViewJobModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

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

  // Same getStatusLabel function as in Applications.jsx
  const getStatusLabel = (status) => {
    const label = status === 0 ? "Open" : status === 1 ? "Closed" : "Closed";
    return label;
  };

  return (
    <div className="border-primary mt-4 mb-4 rounded-lg border bg-[#F0FDF4] p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Job Title and Type - Responsive */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-medium text-gray-900 sm:text-[16px] lg:text-lg">
            {jobData?.jobTitle}
          </h1>
          <div className="text-[12px] text-gray-500 sm:text-[13px]">
            {jobData?.employeeType} | {jobData?.seniorityLevel}
          </div>
        </div>

        {/* Date Information - Responsive */}
        <div className="flex flex-col gap-1 text-center sm:items-center sm:gap-2">
          <div className="text-[12px] text-gray-500 sm:text-[13px]">
            {jobData?.createdAt && formatDate(jobData.createdAt)}
          </div>
          <div className="text-[12px] text-gray-500 sm:text-[13px]">
            {jobData?.deadline
              ? ` ${new Date(jobData?.deadline).toLocaleDateString()}`
              : jobData?.timeAgo}
          </div>
        </div>

        {/* Status, Applicants, and Actions - Responsive */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span
              className={`inline-flex cursor-pointer items-center rounded-[4px] px-2 py-1 text-[11px] font-medium transition-all duration-200 sm:px-3 sm:text-[13px] ${
                getStatusLabel(jobData?.status) === "Open"
                  ? "bg-[#DCFCE7] text-[#166534]"
                  : getStatusLabel(jobData?.status) === "Closed"
                    ? "bg-red-100 text-red-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {t(`jobStatus.${getStatusLabel(jobData?.status).toLowerCase()}`)}
            </span>
            <span className="text-[12px] text-gray-600 sm:text-[13px]">
              {t("applicant")} {jobData?.applicants}
            </span>
          </div>

          {/* More Options - Responsive */}
          <div className="relative">
            <div ref={(el) => (moreOptionsRefs.current[jobData._id] = el)}>
              <button
                className="text-gray-400 transition-colors hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoreOptionsClick(e, jobData._id);
                }}
              >
                <FiMoreVertical
                  size={20}
                  className="rounded-md bg-[#F2F2F2] p-1 text-[#000] sm:size-[25px]"
                />
              </button>

              {/* More Options Dropdown */}
              {moreOptionsDropdownId === jobData._id && (
                <div className="absolute top-full left-5 z-50 mt-1 min-w-[140px] rounded-md border border-gray-200 bg-white shadow-lg sm:right-0 sm:ml-0">
                  <button
                    className="flex w-full items-center px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewJob(jobData._id);
                    }}
                  >
                    <FaEye className="mr-2 ml-5 h-4 w-4" />
                    {t("viewJob")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ViewJobModal isOpen={viewJobModalOpen} onClose={closeViewJobModal} jobId={selectedJobId} />
    </div>
  );
};

export default JobHeader;
