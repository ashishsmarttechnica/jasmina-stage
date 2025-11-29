"use client";

import { getSingleJob, updateApplicationStatus } from "@/api/job.api";
import MobileCompanyProfile from "@/common/MobileCompanyProfile";
import { useAllApplicants } from "@/hooks/company/singleCompany/useSingleApplicationaplicant";
import SetInterviewModal from "@/modal/SetInterviewModal";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Modal } from "rsuite";
import SearchBar from "../../applications/SearchBar";
import ApplicantDetails from "./ApplicantDetails";
import ApplicantList from "./ApplicantList";
import JobHeader from "./JobHeader";

const SingleApplication = () => {
  const params = useParams();

  // Always fetch job data from API - ignore store

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isSetInterviewOpen, setIsSetInterviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [jobData, setJobData] = useState(null);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [applicantsList, setApplicantsList] = useState([]);
  const t = useTranslations("Applications");
  const [isMobile, setIsMobile] = useState(false);

  // Always fetch job details from API using URL params
  useEffect(() => {
    const fetchJobDetails = async () => {
      const jobIdFromParams = params?.subid;
      if (jobIdFromParams) {
        setIsJobLoading(true);
        try {
          const response = await getSingleJob(jobIdFromParams);
          console.log("API Response:", response); // Debug log

          if (response.success && response.data) {
            const jobDetails = response.data;
            console.log("Job Details:", jobDetails); // Debug log
            setJobData(jobDetails);
          } else {
            console.log("No job found in response:", response); // Debug log
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
        } finally {
          setIsJobLoading(false);
        }
      }
    };

    fetchJobDetails();
  }, [params?.subid]);

  useEffect(() => {
    if (jobData) {
      setSelectedApplicant(null);
    }
  }, [jobData]);

  // Get job ID from URL params (primary source)
  const jobId = params?.subid;

  // Fetch applicants data using our custom hook
  const {
    data: applicantsData,
    isLoading,
    isError,
    error,
  } = useAllApplicants(
    jobId, // Job ID from selected job or URL
    page, // Current page
    10, // Limit per page
    activeTab // Status filter
  );

  // Get applicants from the fetched data or use empty array if loading/error
  const applicants = applicantsData?.newApplicants || [];
  const isLastPage = applicantsData?.isLastPage || false;
  const pagination = applicantsData?.pagination || { total: 0 };

  useEffect(() => {
    if (!isMobile && applicants.length > 0 && !selectedApplicant) {
      // Auto-select first applicant when data loads
      setSelectedApplicant(applicants[0]);
    }
  }, [applicants, isMobile, selectedApplicant]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Keep a local list to reflect optimistic updates in the list UI
  useEffect(() => {
    setApplicantsList(applicants);
  }, [applicants]);

  const updateApplicantInList = (applicantId, updatedFields = {}, updatedOriginalData = {}) => {
    setApplicantsList((prevList) =>
      prevList.map((applicant) => {
        const id = applicant._id || applicant.id;
        if (id === applicantId) {
          return {
            ...applicant,
            ...updatedFields,
            originalData: applicant.originalData
              ? { ...applicant.originalData, ...updatedOriginalData }
              : Object.keys(updatedOriginalData).length > 0
                ? { ...updatedOriginalData }
                : applicant.originalData,
          };
        }
        return applicant;
      })
    );
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  // Handle loading more applicants
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleApplicantClick = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const handleStatusChange = (newStatus) => {
    // Update the selected applicant's status immediately
    if (selectedApplicant) {
      setSelectedApplicant({
        ...selectedApplicant,
        status: newStatus,
        originalData: {
          ...selectedApplicant.originalData,
          status: newStatus,
        },
      });

      const targetId = selectedApplicant._id || selectedApplicant.id;
      updateApplicantInList(targetId, { status: newStatus }, { status: newStatus });
    }
  };

  // When interview scheduling succeeds, set status to Interviewing (2)
  const handleInterviewScheduled = async () => {
    if (!selectedApplicant || !jobId) return;
    try {
      await updateApplicationStatus({
        userId: selectedApplicant.userId,
        jobId,
        status: 2,
      });
      setSelectedApplicant((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: 2,
          originalData: {
            ...prev.originalData,
            status: 2,
          },
        };
      });

      const targetId = selectedApplicant._id || selectedApplicant.id;
      updateApplicantInList(targetId, { status: 2 }, { status: 2 });
    } catch (error) {
      console.error("Error updating status to interviewing:", error);
    }
  };

  // Handle loading and error states for job data
  if (isJobLoading) {
    return (
      <div className="flex justify-center p-6 sm:p-10">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-8 w-8 animate-spin text-blue-600 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h3 className="mb-2 text-base font-semibold text-gray-700 sm:text-lg">{t("singleApplication.loadingJob")}</h3>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="flex justify-center p-6 sm:p-10">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400 sm:h-16 sm:w-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
              <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M24 12v12M24 32h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="mb-2 text-base font-semibold text-gray-700 sm:text-lg">{t("singleApplication.noJobSelectedTitle")}</h3>
          <p className="text-sm text-gray-500">{t("singleApplication.noJobSelectedDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Company Profile - Only visible on small screens */}
      <div className="lg:hidden mb-6">
        <MobileCompanyProfile />
      </div>

      {/* Search and Post Job - Responsive */}
      <div className="mb-4 w-full">
        <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-4">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Job Header */}
      <JobHeader jobData={jobData} />

      {/* Filter Tabs */}
      {/* <FilterTabs activeTab={activeTab} setActiveTab={handleTabChange} /> */}

      {/* Applicant Count - Responsive */}
      <div className="mb-4 text-sm text-gray-500 sm:text-base">
        {t("singleApplication.totalApplicants", { count: pagination.total || 0 })}
      </div>

      {isLoading && page === 1 ? (
        <div className="flex justify-center p-6 sm:p-10">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-8 w-8 animate-spin text-blue-600 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 sm:text-base">{t("singleApplication.loadingApplicants")}</p>
          </div>
        </div>
      ) : isError ? (
        <div className="flex justify-center p-6 sm:p-10">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-400 sm:h-16 sm:w-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M24 12v12M24 32h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-red-500 sm:text-base">
              {t("singleApplication.errorLoadingApplicants")}: {error?.message || t("singleApplication.unknownError")}
            </p>
          </div>
        </div>
      ) : applicants.length === 0 ? (
        <div className="flex justify-center p-6 sm:p-10">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400 sm:h-16 sm:w-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M24 12v12M24 32h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 sm:text-base">{t("singleApplication.noApplicantsForJob")}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Content - Responsive Layout */}
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Applicants List */}
            <ApplicantList
              applicants={applicantsList}
              selectedApplicant={selectedApplicant}
              handleApplicantClick={handleApplicantClick}
            />

            {/* Selected Applicant Details */}
            {!isMobile && selectedApplicant && (
              <ApplicantDetails
                selectedApplicant={{
                  ...selectedApplicant,
                  jobId: jobId, // Explicitly pass the jobId
                }}
                jobData={jobData}
                applicants={applicantsData}
                setIsSetInterviewOpen={setIsSetInterviewOpen}
                onStatusChange={handleStatusChange}
              />
            )}
            {/* : (
              <div className="hidden w-full rounded-lg bg-white p-4 text-center shadow-md lg:block lg:w-[60%] sm:p-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <svg className="h-12 w-12 text-gray-400 sm:h-16 sm:w-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                    <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M24 12v12M24 32h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-gray-500 sm:text-base">{t("singleApplication.selectApplicantPlaceholder")}</p>
                </div>
              </div>
            )} */}
          </div>
          {/* Modal for mobile */}
          {isMobile && selectedApplicant && (
            <Modal
              open={!!selectedApplicant}
              onClose={() => setSelectedApplicant(null)}
              size="lg"
              backdrop="static"
            >
              <Modal.Header closeButton className="p-[15px]">
              </Modal.Header>
              <Modal.Body>
                <ApplicantDetails
                  selectedApplicant={{
                    ...selectedApplicant,
                    jobId: jobId, // Explicitly pass the jobId
                  }}
                  jobData={jobData}
                  applicants={applicantsData}
                  setIsSetInterviewOpen={setIsSetInterviewOpen}
                  onStatusChange={handleStatusChange}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button className="bg-[#1D2F38] text-white mt-1" onClick={() => setSelectedApplicant(null)}>
                  {t("modalClose")}
                </Button>
              </Modal.Footer>
            </Modal>
          )}
          {/* Load More Button - Responsive */}
          {!isLastPage && applicants.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? t("loading") : t("loadMore")}
              </button>
            </div>
          )}
        </>
      )}

      <SetInterviewModal
        isOpen={isSetInterviewOpen}
        onClose={() => setIsSetInterviewOpen(false)}
        jobId={jobId}
        jobData={jobData}
        candidateData={selectedApplicant}
        onInterviewScheduled={handleInterviewScheduled}
      />
    </div>
  );
};

export default SingleApplication;
