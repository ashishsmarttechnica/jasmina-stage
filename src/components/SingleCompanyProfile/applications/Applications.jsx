"use client";
import MobileCompanyProfile from "@/common/MobileCompanyProfile";
import Selecter from "@/common/Selecter";
import useSingleCompanyAppliedJob from "@/hooks/company/singleCompany/useSingleCompanyAppliedJob";
import useUpdateJobStatus from "@/hooks/company/singleCompany/useUpdateJobStatus";
import { Link, useRouter } from "@/i18n/navigation";
import ViewJobModal from "@/modal/ViewJobModal";
import useSingleCompanyAppliedJobStore from "@/store/singleCopanyAppliedJob.store";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { FiChevronDown, FiMoreVertical } from "react-icons/fi";
import { getRelativeTime } from "../../../utils/dateUtils";
import SearchBar from "./SearchBar";
import { RiEdit2Fill } from "react-icons/ri";

const Applications = () => {
  const router = useRouter();
  const t = useTranslations("Applications");
  const params = useParams();
  const setSelectedJob = useSingleCompanyAppliedJobStore((state) => state.setSelectedJob);
  const pagination = useSingleCompanyAppliedJobStore((state) => state.pagination);

  const [selectedStatus, setSelectedStatus] = useState(t("statusFilter.all"));
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRefs = useRef({});

  // New state for view job modal and dropdown
  const [viewJobModalOpen, setViewJobModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [moreOptionsDropdownId, setMoreOptionsDropdownId] = useState(null);
  const moreOptionsRefs = useRef({});

  const statusOptions = [
    { value: t("statusFilter.all"), label: t("statusFilter.all"), numericValue: "" },
    { value: t("jobStatus.open"), label: t("jobStatus.open"), numericValue: "0" },
    { value: t("jobStatus.closed"), label: t("jobStatus.closed"), numericValue: "1" },
  ];

  // Get the numeric status value for API call
  const getStatusValue = (selectedStatus) => {
    const option = statusOptions.find((opt) => opt.value === selectedStatus);
    return option ? option.numericValue : "";
  };

  const {
    data: getCompanyAppliedJob,
    isLoading: isGetCompanyAppliedJobLoading,
    isFetching: isFetchingJobs,
    isError: isGetCompanyAppliedJobError,
    error: getCompanyAppliedJobError,
    refetch: refetchJobs,
  } = useSingleCompanyAppliedJob(params.id, searchQuery, getStatusValue(selectedStatus), page, 10);

  // Add the update job status mutation
  const { mutate: updateJobStatus, isPending: isUpdatingStatus } = useUpdateJobStatus();

  const getStatusLabel = (status, jobId) => {
    const label = status === 0 ? "Open" : status === 1 ? "Closed" : "Closed";
    return label;
  };

  const handleStatusClick = (e, jobId, currentStatus) => {
    e.stopPropagation();
    // Don't do anything if status is Closed
    if (currentStatus === 1) return;
    // Toggle dropdown for Open status
    toggleDropdown(jobId);
  };

  const handleStatusChange = (jobId, newStatus, currentStatus) => {
    // console.log("Current Status:", currentStatus, "New Status:", newStatus); // For debugging

    // Call the API to update job status
    updateJobStatus({
      jobId: jobId,
      status: newStatus,
    });

    // Close dropdown immediately for better UX
    setOpenDropdownId(null);
  };

  const handleCloseJob = (jobId, currentStatus) => {
    handleStatusChange(jobId, 1, currentStatus);
  };

  const toggleDropdown = (jobId) => {
    const job = jobListings.find((item) => item._id === jobId);
    if (job?.status === 1) return;
    setOpenDropdownId(openDropdownId === jobId ? null : jobId);
  };

  //
  const handleJobClick = (item) => {
    setSelectedJob(item); // Store the selected job data
    router.push(`/company/single-company/${params.id}/applications/${item._id}`);
  };

  const handleStatusChangeFilter = (e) => {
    setSelectedStatus(e.target.value);
    setPage(1);
    // Trigger search when status changes
    setTimeout(() => {
      refetchJobs();
    }, 100);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    setIsSearching(true);
    setPage(1);
    refetchJobs().finally(() => {
      setIsSearching(false);
    });
  };

  const handleLoadMore = () => {
    if (pagination?.totalPages && page < pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // New handlers for view job functionality
  const handleViewJob = (jobId) => {
    setSelectedJobId(jobId);
    setIsEditMode(false);
    setViewJobModalOpen(true);
    setMoreOptionsDropdownId(null); // Close dropdown
  };

  const handleEditJob = (jobId) => {
    setSelectedJobId(jobId);
    setIsEditMode(true);
    setViewJobModalOpen(true);
    setMoreOptionsDropdownId(null); // Close dropdown
  };

  const handleMoreOptionsClick = (e, jobId) => {
    e.stopPropagation();
    setMoreOptionsDropdownId(moreOptionsDropdownId === jobId ? null : jobId);
  };

  const closeViewJobModal = () => {
    setViewJobModalOpen(false);
    setSelectedJobId(null);
    setIsEditMode(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any open dropdown
      const isOutsideAllDropdowns = Object.values(dropdownRefs.current).every(
        (ref) => !ref || !ref.contains(event.target)
      );
      const isOutsideMoreOptionsDropdowns = Object.values(moreOptionsRefs.current).every(
        (ref) => !ref || !ref.contains(event.target)
      );

      if (isOutsideAllDropdowns && openDropdownId) {
        setOpenDropdownId(null);
      }

      if (isOutsideMoreOptionsDropdowns && moreOptionsDropdownId) {
        setMoreOptionsDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId, moreOptionsDropdownId]);

  const jobListings = getCompanyAppliedJob || [];

  return (
    <div className="w-full">
      {/* Mobile Company Profile - Only visible on small screens */}
      <div className="mb-6 lg:hidden">
        <MobileCompanyProfile />
      </div>

      {/* Search Section - Responsive */}
      <div className="mb-4 w-full">
        <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-2">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar
              searchValue={searchQuery}
              onSearch={handleSearch}
              onSearchSubmit={handleSearchSubmit}
              isSearching={isSearching}
            />
          </div>
        </div>
      </div>

      {/* Filter Section - Responsive */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="w-full sm:w-40">
          <Selecter
            name="status"
            value={selectedStatus}
            onChange={handleStatusChangeFilter}
            options={statusOptions}
            placeholder="Select Status"
          />
        </div>
      </div>

      {/* Jobs List - Responsive */}
      <div className="rounded-xl bg-white shadow-sm">
        {jobListings && jobListings.length > 0 ? (
          jobListings.map((item, idx) => (
            <div
              key={item._id || idx}
              onClick={() => {
                handleJobClick(item);
              }}
              className="flex cursor-pointer flex-col gap-3 border-b border-[#E4E6EA] px-4 py-4 transition-all duration-300 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:gap-4"
            >
              {/* Left section - Title and Type - Responsive */}
              <div className="min-w-0 flex-[2]">
                <h3 className="truncate text-[14px] font-medium text-[#1B1B1B] sm:text-[15px] lg:text-base">
                  {item.jobTitle}
                </h3>
                <p className="text-[12px] text-[#888DA8] sm:text-[13px]">
                  {item.employeeType} | {item.seniorityLevel}
                </p>
              </div>

              {/* Middle section - Date and Time - Responsive */}
              <div className="flex flex-col items-start gap-1 sm:flex-1 sm:text-center">
                <p className="text-[12px] text-[#888DA8] sm:text-[13px]">
                  {new Date(item.createdAt)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, ", ")}
                </p>
                <p className="text-[12px] text-[#888DA8] sm:text-[13px]">
                  {getRelativeTime(item.deadline)}
                </p>
              </div>

              {/* Status Section - Responsive */}
              <div className="flex items-center justify-between gap-2 sm:flex-1 sm:justify-end">
                <div className="relative" ref={(el) => (dropdownRefs.current[item._id] = el)}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick(e, item._id, item.status);
                    }}
                    disabled={isUpdatingStatus}
                    className={`inline-flex cursor-pointer items-center rounded-[4px] px-2 py-1 text-[12px] font-medium transition-all duration-200 hover:opacity-80 sm:px-3 sm:text-[13px] ${getStatusLabel(item.status) === "Open"
                      ? "bg-[#DCFCE7] text-[#166534]"
                      : getStatusLabel(item.status) === "Closed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                      } ${isUpdatingStatus ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {isUpdatingStatus && item._id === openDropdownId ? (
                      <>
                        <svg
                          className="mr-1 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className="hidden sm:inline">Updating...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <span>{t(`jobStatus.${getStatusLabel(item.status).toLowerCase()}`)}</span>
                        {/* Show dropdown icon only for Open status */}
                        {item.status === 0 && <FiChevronDown className="ml-1" size={14} />}
                      </>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdownId === item._id && item.status === 0 && (
                    <div className="absolute top-full left-5 z-10 mt-1 min-w-[120px] rounded-md border border-gray-200 bg-white shadow-lg sm:right-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseJob(item._id, item.status);
                        }}
                        disabled={isUpdatingStatus}
                        className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdatingStatus && item._id === openDropdownId ? (
                          <>
                            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Closing...
                          </>
                        ) : (
                          t("jobStatus.closed")
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Applicants count - Responsive */}
              <div className="flex items-center justify-between gap-2 sm:flex-1 sm:justify-center">
                <Link
                  href={`/applicationjob/${item._id}`}
                  className="text-[12px] text-[#0B5CFF] underline hover:underline sm:text-[13px]"
                >
                  {t("applicant")} {item.applicants}
                </Link>
              </div>

              {/* More Options - Responsive */}
              <div className="flex justify-end sm:ml-2">
                <div className="relative" ref={(el) => (moreOptionsRefs.current[item._id] = el)}>
                  <button
                    onClick={(e) => handleMoreOptionsClick(e, item._id)}
                    className="p-1 text-gray-500 transition-colors hover:text-black"
                  >
                    <FiMoreVertical
                      size={20}
                      className="rounded-md bg-[#F2F2F2] p-1 text-[#000] sm:size-[25px]"
                    />
                  </button>

                  {/* More Options Dropdown */}
                  {moreOptionsDropdownId === item._id && (
                    <div className="absolute top-full right-0 z-20 mt-1 min-w-[140px] rounded-md border border-gray-200 bg-white shadow-lg">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewJob(item._id);
                        }}
                        className="flex w-full items-center px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <FaEye className="mr-2 h-4 w-4" />
                        {t("viewJob")}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditJob(item._id);
                        }}
                        className="flex w-full items-center px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <RiEdit2Fill className="mr-2 h-4 w-4" />
                        {t("editJob")}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center sm:h-[400px]">
            <div className="flex flex-col items-center justify-center px-4 text-center">
              {/* No data illustration */}
              <svg
                className="mb-4 h-12 w-12 text-gray-400 sm:h-16 sm:w-16"
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
              <h3 className="mb-2 text-base font-semibold text-gray-700 sm:text-lg">
                {searchQuery ? t("noJobs.titleWhenSearch") : t("noJobs.titleNoData")}
              </h3>
              <p className="text-xs text-gray-500 sm:text-sm">
                {searchQuery
                  ? t("noJobs.descWhenSearch", { query: searchQuery })
                  : t("noJobs.descNoData")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Load More Button - Responsive */}
      {jobListings.length > 0 && pagination?.totalPages > page && (
        <div className="mt-4 flex w-full justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingJobs}
            className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {isFetchingJobs ? t("loading") : t("loadMore")}
          </button>
        </div>
      )}

      {/* View Job Modal */}
      <ViewJobModal isOpen={viewJobModalOpen} onClose={closeViewJobModal} jobId={selectedJobId} isEditMode={isEditMode} />
    </div>
  );
};

export default Applications;
