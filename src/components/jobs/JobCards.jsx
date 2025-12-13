"use client";
import noPostImage from "@/assets/feed/no-post.svg";
import galleryIcon from "@/assets/gallery.png";
import Card from "@/common/card/Card";
import ImageFallback from "@/common/shared/ImageFallback";
import { useAllJobs } from "@/hooks/job/useGetJobs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoClipboardOutline } from "react-icons/io5";
import { Button, Modal } from "rsuite";
import getImg from "../../lib/getImg";
import { getRelativeTime } from "../../utils/dateUtils";
import SingleJobDetail from "./SingleJobDetail";
const JobCards = ({ filters }) => {
  const urlSearchParams = useSearchParams();
  const router = useRouter();
  const selectedJobIdFromUrl = urlSearchParams.get("selectedJobId");

  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const t = useTranslations("Jobs");
  const [isMobile, setIsMobile] = useState(false);
  const prevIsMobileRef = useRef(false);
  const selectedJobIdRef = useRef(null);
  // Always use filters for search, with default values
  const searchParams = {
    search: filters.search || "",
    location: filters.location || "",
    lgbtq: filters.lgbtq !== undefined ? filters.lgbtq : true,
    page: page,
    limit: 100, // Increased limit to 100 as requested
  };

  const { data, isLoading, error } = useAllJobs(searchParams);
  const jobs = data?.jobs || [];
  const pagination = data?.pagination || {};
  const isLastPage = data?.isLastPage || false;
  const totalPages = pagination?.totalPages || 0;
  const totalJobs = pagination?.total || 0;


  // Reset to page 1 and visibleCount when filters change
  useEffect(() => {
    setPage(1);
    setVisibleCount(3);
    // Don't clear selected job when filters change - let the next useEffect handle it
    // This allows the job details to remain visible when clearing filters
  }, [filters]);

  // Map API job data to UI job shape - use useMemo to prevent infinite loops
  const mappedJobs = useMemo(() => {
    return jobs.map((job) => {
      console.log("Job data:", job);
      console.log("isLGBTQFriendly from API:", job?.isLGBTQFriendly);
      console.log("companyId:", job?.companyId);
      console.log("company:", job?.company);

      return {
        _id: job._id,
        title: job.jobTitle || job.title || "-",
        experience: job.experience ? `${job.experience} ${t("years")}` : "-",
        location: job.jobLocation || job.location || "-",
        tag: job.company?.isLGBTQFriendly ? t("lgbtqFriendly") : "",
        skills: job.requiredSkills || [],
        company: job.companyId?.companyName || "-",
        url: job.company?.website || "",
        logo: job.company?.logoUrl
          ? job.company.logoUrl.startsWith("http")
            ? job.company.logoUrl
            : `${process.env.NEXT_PUBLIC_API_URL}/${job.company.logoUrl}`
          : "https://logo.clearbit.com/placeholder.com",
        type: job.employeeType || job.type || "-",
        genderPrefereance: job.genderPrefereance || "-",
        education: job.education || "-",
        salary: job.salaryRange || job.salary || "-",
        seniority: job.seniorityLevel || job.seniority || "-",
        applicants: job.applicants || 0,
        description: job.description?.replace(/<[^>]+>/g, "") || "-",
        responsibilities: job.responsibilities
          ? Array.isArray(job.responsibilities)
            ? job.responsibilities
            : job.responsibilities
              .replace(/<[^>]+>/g, "")
              .split("\n")
              .filter(Boolean)
          : [],
        requiredSkills: job.requiredSkills
          ? Array.isArray(job.requiredSkills)
            ? job.requiredSkills
            : job.requiredSkills.split(",")
          : [],

        posted: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-",
        website: job?.companyId?.website,
        logoImage: job?.companyId?.logoUrl,
        isLGBTQFriendly: job?.companyId?.isLGBTQFriendly || false,
        _raw: job,
      };
    });
  }, [jobs, t]);

  // When jobs are filtered, if the selected job is not in the new list, clear the selection.
  // Use the mapped jobs to check if the selected job's ID exists in the current list
  useEffect(() => {
    if (selectedJob && mappedJobs.length > 0) {
      const isSelectedJobInList = mappedJobs.some((job) => job._id === selectedJob._id);
      if (!isSelectedJobInList) {
        // Only clear if the selected job is not in the new list
        setSelectedJob(null);
      }
      // If the selected job is in the list, keep it selected (don't clear)
    } else if (selectedJob && mappedJobs.length === 0) {
      // If there are no jobs but we have a selected job, keep it (user cleared filters)
      // Don't clear it, let it remain visible
    }
  }, [mappedJobs, selectedJob]);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      // Only clear selected job when switching from desktop to mobile
      if (newIsMobile && !prevIsMobileRef.current) {
        setSelectedJob((prev) => {
          // Clear only if we're switching from desktop to mobile
          return null;
        });
      }
      prevIsMobileRef.current = newIsMobile;
      setIsMobile(newIsMobile);
    };

    // Initialize on mount
    const initialIsMobile = window.innerWidth < 768;
    prevIsMobileRef.current = initialIsMobile;
    setIsMobile(initialIsMobile);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Select job from URL parameter if present - use ref to prevent infinite loop
  const hasProcessedUrlRef = useRef(false);
  useEffect(() => {
    if (selectedJobIdFromUrl && mappedJobs.length > 0 && !isMobile && !hasProcessedUrlRef.current) {
      const jobToSelect = mappedJobs.find((job) => job._id === selectedJobIdFromUrl);
      if (jobToSelect) {
        setSelectedJob(jobToSelect);
        hasProcessedUrlRef.current = true;
        // Remove the query parameter from URL after selecting
        const params = new URLSearchParams(urlSearchParams.toString());
        params.delete("selectedJobId");
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.replace(newUrl, { scroll: false });
      }
    }
    // Reset ref when selectedJobIdFromUrl changes
    if (!selectedJobIdFromUrl) {
      hasProcessedUrlRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJobIdFromUrl, mappedJobs.length, isMobile]);

  // Update ref when selectedJob changes
  useEffect(() => {
    selectedJobIdRef.current = selectedJob?._id || null;
  }, [selectedJob]);

  // Auto-select the first job by default when jobs are loaded or changed (only on desktop)
  useEffect(() => {
    if (!isMobile && mappedJobs.length > 0 && !selectedJobIdFromUrl && !hasProcessedUrlRef.current) {
      // If no job is selected, or selected job is not in current list, select first job
      // But only if there's no selectedJobIdFromUrl (to avoid overriding URL-based selection)
      const currentSelectedId = selectedJobIdRef.current;
      const isSelectedJobInList = currentSelectedId && mappedJobs.some((job) => job._id === currentSelectedId);
      if (!currentSelectedId || !isSelectedJobInList) {
        setSelectedJob(mappedJobs[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappedJobs.length, isMobile, selectedJobIdFromUrl]);

  if (isLoading && page === 1) return <div>{t("loadingJobs")}</div>;
  if (error)
    return (
      <div>
        {t("errorLoadingJobs")}: {error.message}
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-1 md:flex-row">
      <div className="mb-4 w-full md:mb-0 md:w-[35%] card-main md:pr-2">
        {/* <div className="flex flex-col gap-4"> */}
        <div className="text-sm text-gray-500">{totalJobs === 0 && <p>{t("Nojobsfound")}</p>}</div>

        {mappedJobs.length > 0 ? (
          mappedJobs.slice(0, visibleCount).map(
            (job, index) => (
              (
                <Card
                  key={`${job._id}-${index}`}
                  className={`mb-3 w-full card-main sm:w-full md:w-full xl:w-full cursor-pointer border-2 transition-all duration-200 hover:border-green-700 hover:bg-green-50 ${selectedJob?._id === job._id
                    ? "border-green-700 bg-green-200"
                    : "border-gray-300"
                    }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="p-4">
                    <h3 className="mb-2 truncate text-lg font-semibold text-gray-800">
                      {job.title}
                    </h3>
                    <p className="mb-1 flex items-center gap-2 text-sm text-gray-600">
                      <IoClipboardOutline className="h-4 w-4" />
                      <span className="leading-relaxed break-words">{job.experience}</span>
                    </p>
                    <p className="mb-1 flex items-center gap-2 text-sm text-gray-600">
                      <HiOutlineLocationMarker className="h-4 w-4" />
                      <span className="leading-relaxed break-words">{job.location}</span>
                    </p>
                    <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">{job?.createdAt}</div>
                    <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">
                      <p>
                        {t("Posted")} {getRelativeTime(job.posted)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-start gap-2 border-t border-slate-200 pt-3">
                      <ImageFallback
                        src={job?.logoImage ? getImg(job.logoImage) : undefined}
                        fallbackSrc={noPostImage}
                        alt="logo"
                        width={28}
                        height={28}
                        className="mt-1 rounded-md"
                      />
                      <div className="flex w-full flex-col">
                        <div className="flex items-center gap-2 text-sm text-gray-500 leading-relaxed break-words">
                          {job?.company || t("unknownCompany")}
                          {job?.isLGBTQFriendly === true && (
                            <Image
                              src={galleryIcon}
                              alt="LGBTQ friendly"
                              width={22}
                              height={22}
                              className="inline-block"
                            />
                          )}
                        </div>
                        <div className="w-full max-w-full text-[13px] break-all whitespace-normal text-[#007BFF] leading-relaxed">
                          {job?.website}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            )
          )
        ) : (
          !isLoading && (
            <div className="flex w-full items-center justify-center py-16 px-4">
              <div className="flex w-full max-w-md flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                  <svg
                    className="h-14 w-14 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  {t("Nojobsfound")}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {t("noJobsMatchingCriteria")}
                </p>
                <div className="mt-2 rounded-lg bg-emerald-50/50 border border-emerald-100 px-4 py-3 text-xs text-gray-600">
                  <p className="font-medium text-emerald-700 mb-1">💡 Tip:</p>
                  <p className="text-gray-600">
                    Try adjusting your search filters or location to find more opportunities.
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        {visibleCount < mappedJobs.length && (
          <div className="mt-2 textcenter text-left">
            <button
              className="mt-2 rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800"
              onClick={() => setVisibleCount((prev) => prev + 3)}
            >
              {t("loadMore")}
            </button>
          </div>
        )}

        {visibleCount >= mappedJobs.length && mappedJobs.length > 0 && (
          <div className="mt-2 text-center text-gray-500">
            <p>{t("noMoreJobsToLoad")}</p>
          </div>
        )}
      </div>
      {/* </div> */}
      {/* Right Column: Job Detail */}
      {!isMobile && selectedJob && (
        <div className="w-full md:w-[65%]">
          <div className="sticky top-12 px-2">
            <SingleJobDetail
              job={selectedJob}
              logoImage={selectedJob?.logoImage}
              onBack={() => setSelectedJob(null)}
              searchFilters={filters}
            />
          </div>
        </div>
      )}

      {/* Modal for mobile */}
      {isMobile && selectedJob && (
        <Modal
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          size="lg"
          backdrop="static"
        >
          <Modal.Header closeButton className="p-[15px]">
          </Modal.Header>
          <Modal.Body>
            <SingleJobDetail
              job={selectedJob}
              logoImage={selectedJob?.logoImage}
              onBack={() => setSelectedJob(null)}
              searchFilters={filters}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-[#1D2F38] text-white mt-1" onClick={() => setSelectedJob(null)}>
              {t("modalClose")}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default JobCards;
