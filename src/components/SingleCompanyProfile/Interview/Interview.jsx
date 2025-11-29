"use client";
import { getCompanyAppliedJob } from "@/api/company.api";
import { cancelInterview, getAllInterviews } from "@/api/interview.api";
import MobileCompanyProfile from "@/common/MobileCompanyProfile";
import useSingleCompanyAppliedJobStore from "@/store/singleCopanyAppliedJob.store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SetInterviewModal from "../../../modal/SetInterviewModal";

const Interviews = () => {
  const params = useParams();
  const dropdownRef = useRef(null);
  const t = useTranslations("Interviews");

  // Get the selected job from the store
  const selectedJobFromStore = useSingleCompanyAppliedJobStore((state) => state.selectedJob);
  const setSelectedJob = useSingleCompanyAppliedJobStore((state) => state.setSelectedJob);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [page, setPage] = useState(1);
  const [isSetInterviewOpen, setIsSetInterviewOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [allInterviews, setAllInterviews] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 10;
  const queryClient = useQueryClient();

  // Fetch job details if not available in store
  useEffect(() => {
    const fetchJobDetails = async () => {
      // If we have job data in store, use it
      if (selectedJobFromStore && selectedJobFromStore._id) {
        setJobData(selectedJobFromStore);
        return;
      }

      // If no job in store but we have job ID in URL params, fetch it
      const jobIdFromParams = params?.subid;
      if (jobIdFromParams && !selectedJobFromStore) {
        setIsJobLoading(true);
        try {
          const response = await getCompanyAppliedJob(jobIdFromParams, "", "", 1, 1);

          if (response.success && response.data.jobs && response.data.jobs.length > 0) {
            const jobDetails = response.data.jobs[0];
            setJobData(jobDetails);
            setSelectedJob(jobDetails); // Save to store for persistence
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
        } finally {
          setIsJobLoading(false);
        }
      } else if (selectedJobFromStore) {
        // If we have some job data in store, use it
        setJobData(selectedJobFromStore);
      }
    };

    fetchJobDetails();
  }, [selectedJobFromStore, params?.subid, setSelectedJob]);

  useEffect(() => {
    if (selectedJobFromStore) {
      setSelectedApplicant(null);
    }
  }, [selectedJobFromStore]);

  // Reset interviews when tab changes
  useEffect(() => {
    setAllInterviews([]);
    setPage(1);
    setHasMore(true);
  }, [activeTab]);

  // Get job ID from job data or URL params
  const jobId = jobData?._id || params?.subid;

  const getStatusNumber = (status) => {
    switch (status) {
      case "upcoming":
        return 1;
      case "past":
        return 2;
      default:
        return 1;
    }
  };

  const {
    data: interviewData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["interviews", activeTab, page],
    queryFn: () =>
      getAllInterviews({
        page,
        limit,
        status: getStatusNumber(activeTab),
        companyId: Cookies.get("userId"),
      }),
  });

  // Update interviews when new data comes in
  useEffect(() => {
    if (interviewData?.data?.jobs) {
      if (page === 1) {
        setAllInterviews(interviewData.data.jobs);
      } else {
        setAllInterviews(prev => [...prev, ...interviewData.data.jobs]);
      }

      // Check if there are more interviews to load
      setHasMore(interviewData.data.jobs.length === limit);
    }
  }, [interviewData, page, limit]);

  const interviews = allInterviews;
 // console.log(interviews, "interviews");

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);

    try {
      await queryClient.fetchQuery({
        queryKey: ["interviews", activeTab, nextPage],
        queryFn: () =>
          getAllInterviews({
            page: nextPage,
            limit,
            status: getStatusNumber(activeTab),
            companyId: Cookies.get("userId"),
          }),
      });
    } catch (error) {
      console.error("Error loading more interviews:", error);
      setPage(page); // Revert page on error
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleCancelInterview = async (interviewId) => {
    try {
      await cancelInterview(interviewId);
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    } catch (error) {
      console.error("Error canceling interview:", error);
    }
  };

  const handleReschedule = (interview) => {
    setSelectedInterview(interview);
    setSelectedApplicant({
      userId: interview.userId,
      name: interview.fullName,
      email: interview.email,
      jobRole: interview.jobRole,
      experience: interview.experience,
      resume: interview.resume,
    });
    setIsSetInterviewOpen(true);
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex h-[300px] items-center justify-center sm:h-[400px]">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-8 w-8 animate-spin text-blue-600 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 sm:text-base">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[300px] items-center justify-center sm:h-[400px]">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-400 sm:h-16 sm:w-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
              <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M24 12v12M24 32h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm text-red-500 sm:text-base">{t("error")}</p>
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

      <div className="p-2">
        {/* Tabs - Responsive */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {["upcoming", "past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium shadow-md transition-colors sm:px-4 sm:text-[13px] ${activeTab === tab
                ? "bg-primary text-white"
                : "hover:bg-secondary hover:text-primary bg-[#F2F2F2] text-[#888DA8]"
                }`}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <div className="rounded-lg bg-white shadow-md">
            {interviews.map((interview, index) => (
              <div
                key={interview._id}
                className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3"
              >
                {/* Interview Info - Responsive */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-medium text-gray-900 sm:text-[14px]">
                    {interview?.userId?.profile?.fullName}
                  </h3>
                  <p className="text-[11px] text-gray-500 sm:text-sm">
                    {interview?.userId?.preferences?.jobRole}
                  </p>
                </div>

                {/* Date and Time - Responsive */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1 text-[11px] text-black sm:flex-row sm:text-sm">
                    <p>{format(new Date(interview.date), "dd/MM/yyyy")}</p>
                    <span className="hidden sm:inline px-1">·</span>
                    <p>{interview.startTime}</p>
                  </div>
                </div>

                {/* Action Buttons - Responsive */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    className="bg-primary hover:text-primary hover:border-primary w-full rounded-sm px-3 py-2 text-[12px] text-white transition-colors hover:border hover:bg-white sm:w-auto sm:text-[13px]"
                    onClick={() => handleReschedule(interview)}
                  >
                    {t("reschedule")}
                  </button>
                  <button
                    className="text-primary border-primary w-full rounded border px-3 py-2 text-[12px] font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm"
                    onClick={() => handleCancelInterview(interview._id)}
                  >
                    {t("cancel")}
                  </button>
                </div>

                <SetInterviewModal
                  isOpen={isSetInterviewOpen}
                  onClose={() => {
                    setIsSetInterviewOpen(false);
                    setSelectedInterview(null);
                    setSelectedApplicant(null);
                  }}
                  jobId={interview.jobId}
                  candidateData={selectedApplicant}
                  interviewId={selectedInterview?._id}
                  jobData={jobData}
                  isReschedule={true}
                />
              </div>
            ))}

            {interviews.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400 sm:h-16 sm:w-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                    <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M24 12v12M24 32h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 sm:text-base">{t("empty")}</p>
              </div>
            )}

            {/* Load More Button */}
            {hasMore && interviews.length > 0 && (
              <div className="flex justify-center p-4">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interviews;
