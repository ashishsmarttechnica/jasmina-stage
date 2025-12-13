"use client";
import noPostImage from "@/assets/feed/no-post.svg";
import galleryIcon from "@/assets/gallery.png";
import ImageFallback from "@/common/shared/ImageFallback";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoClipboardOutline } from "react-icons/io5";
import { Button, Modal } from "rsuite";
import Card1 from "../../common/card/Card1";
import getImg from "../../lib/getImg";
import { getRelativeTime } from "../../utils/dateUtils";
import SingleJobDetailHome from "../jobs/SingleJobDetailHome";

// This component now receives jobs from the global job store instead of calling its own API
const JobCardDetails = ({ filters, jobs = [], loading, error }) => {

    const [selectedJob, setSelectedJob] = useState(null);
    const [visibleCount, setVisibleCount] = useState(3);
    const t = useTranslations("Jobs");
    const [isMobile, setIsMobile] = useState(false);
    const prevIsMobileRef = useRef(false);

    // Map job data from store to UI job shape
    const mappedJobs = jobs.map((job) => {
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

    // Reset visible jobs when filters or incoming jobs change
    useEffect(() => {
        setVisibleCount(3);
        // Don't clear selected job when filters change - let the next useEffect handle it
        // This allows the job details to remain visible when clearing filters
    }, [filters, jobs.length]);

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

    // Auto-select the first job by default when jobs are loaded or changed (only on desktop)
    useEffect(() => {
        if (!isMobile && mappedJobs.length > 0 && !selectedJob) {
            setSelectedJob(mappedJobs[0]);
        }
    }, [mappedJobs, selectedJob, isMobile]);

    if (loading && mappedJobs.length === 0) {
        return (
            <div className="flex w-full flex-col gap-4 md:flex-row animate-pulse">
                {/* Left column - job list skeleton */}
                <div className="mb-4 w-full md:mb-0 md:w-[38%] md:pr-3">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="h-4 w-20 rounded bg-gray-200"></div>
                        <div className="h-6 w-16 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full max-[767px]:max-w-full max-w-[350px] min-[696px]:max-w-[450px] rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm">
                                <div className="mb-2 flex items-start justify-between gap-3">
                                    <div className="h-5 flex-1 rounded bg-gray-200"></div>
                                    <div className="h-6 w-20 rounded-full bg-gray-200"></div>
                                </div>
                                <div className="mb-1 flex items-center gap-2">
                                    <div className="h-4 w-4 rounded bg-gray-200"></div>
                                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                                </div>
                                <div className="mb-1 flex items-center gap-2">
                                    <div className="h-4 w-4 rounded bg-gray-200"></div>
                                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="h-3 w-20 rounded bg-gray-200"></div>
                                    <div className="h-5 w-16 rounded-full bg-gray-200"></div>
                                </div>
                                <div className="mt-3 flex items-start gap-3 border-t border-slate-100 pt-3">
                                    <div className="h-8 w-8 rounded-md bg-gray-200"></div>
                                    <div className="flex-1 space-y-1">
                                        <div className="h-4 w-28 rounded bg-gray-200"></div>
                                        <div className="h-3 w-36 rounded bg-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column - job detail skeleton */}
                {!isMobile && (
                    <div className="w-full md:w-full sm:w-full">
                        <div className="sticky top-16 rounded-xl bg-white p-4 shadow-sm md:p-5">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <div className="h-6 w-3/4 rounded bg-gray-200"></div>
                                    <div className="h-5 w-5 rounded bg-gray-200"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                                    <div className="h-4 w-40 rounded bg-gray-200"></div>
                                </div>
                                <div className="h-9 w-32 rounded bg-gray-200"></div>
                                <div className="border-t border-slate-100 pt-3">
                                    <div className="mb-2 h-5 w-32 rounded bg-gray-200"></div>
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="h-4 w-4 rounded bg-gray-200"></div>
                                                <div className="h-4 w-40 rounded bg-gray-200"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-t border-slate-100 pt-3">
                                    <div className="mb-2 h-5 w-32 rounded bg-gray-200"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full rounded bg-gray-200"></div>
                                        <div className="h-4 w-full rounded bg-gray-200"></div>
                                        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 border-t border-slate-100 pt-3">
                                    <div className="h-7 w-7 rounded-md bg-gray-200"></div>
                                    <div className="flex-1 space-y-1">
                                        <div className="h-4 w-32 rounded bg-gray-200"></div>
                                        <div className="h-3 w-40 rounded bg-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    if (error) {
        return (
            <div>
                {t("errorLoadingJobs")}: {error.message || error.toString()}
            </div>
        );
    }

    // Show empty state when no jobs
    if (mappedJobs.length === 0 && !loading) {
        return (
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
                        <p className="font-medium text-emerald-700 mb-1">💡 {t("Tip")}:</p>
                        <p className="text-gray-600">
                            {t("TryAdjustingFilters")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4 md:flex-row">
            {/* Left column – list */}
            <div className="mb-4 w-full md:mb-0 md:w-[38%] md:pr-3">
                <div className="mb-3 flex items-center justify-between">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        {t("myJobs")}
                    </div>
                    {mappedJobs.length > 0 && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {mappedJobs.length} {t("jobs")}
                        </span>
                    )}
                </div>

                {mappedJobs.length > 0 ? (
                    <div className="space-y-3">
                        {mappedJobs.slice(0, visibleCount).map((job, index) => (
                            <Card1
                                key={`${job._id}-${index}`}
                                className={`w-full cursor-pointer rounded-xl max-[767px]:max-w-full max-w-[350px] min-[696px]:max-w-[450px] border bg-white/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md ${selectedJob?._id === job._id
                                    ? "border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-500/60"
                                    : "border-gray-200"
                                    }`}
                                onClick={() => setSelectedJob(job)}
                            >
                                <div className="p-4">
                                    <div className="mb-2 flex items-start justify-between gap-3">
                                        <h3 className="flex-1 truncate text-[15px] font-semibold text-gray-900">
                                            {job.title}
                                        </h3>
                                        {job?.isLGBTQFriendly === true && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-700">
                                                <Image
                                                    src={galleryIcon}
                                                    alt="LGBTQ friendly"
                                                    width={16}
                                                    height={16}
                                                    className="inline-block"
                                                />
                                                {t("lgbtqFriendly")}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mb-1 flex items-center gap-2 text-xs text-gray-600">
                                        <IoClipboardOutline className="h-4 w-4 text-emerald-600" />
                                        <span className="leading-relaxed break-words">{job.experience}</span>
                                    </p>
                                    <p className="mb-1 flex items-center gap-2 text-xs text-gray-600">
                                        <HiOutlineLocationMarker className="h-4 w-4 text-sky-600" />
                                        <span className="leading-relaxed break-words">{job.location}</span>
                                    </p>

                                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#888DA8]">
                                        <p>
                                            {t("Posted")} {getRelativeTime(job.posted)}
                                        </p>
                                        {job.type && (
                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-gray-700">
                                                {job.type}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-start gap-3 border-t border-slate-100 pt-3">
                                        <ImageFallback
                                            src={job?.logoImage ? getImg(job.logoImage) : undefined}
                                            fallbackSrc={noPostImage}
                                            alt="logo"
                                            width={32}
                                            height={32}
                                            className="mt-0.5 rounded-md ring-1 ring-gray-200"
                                        />
                                        <div className="flex w-full flex-col">
                                            <div className="mb-0.5 flex items-center gap-2 text-[13px] leading-relaxed break-words text-gray-700">
                                                {job?.company || t("unknownCompany")}
                                            </div>
                                            <div className="w-full max-w-full text-[11px] leading-relaxed break-all whitespace-normal text-sky-600">
                                                {job?.website}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card1>
                        ))}
                    </div>
                ) : null}

                {visibleCount < mappedJobs.length && (
                    <div className="mt-3 flex justify-center">
                        <button
                            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
                            onClick={() => setVisibleCount((prev) => prev + 3)}
                        >
                            {t("loadMore")}
                        </button>
                    </div>
                )}

                {visibleCount >= mappedJobs.length && mappedJobs.length > 0 && (
                    <div className="mt-3 text-center text-xs text-gray-500">
                        <p>{t("noMoreJobsToLoad")}</p>
                    </div>
                )}
            </div>

            {/* Right Column: Job Detail */}
            {!isMobile && selectedJob && (
                <div className="w-full md:w-[62%]">
                    <div className="sticky top-16 rounded-xl bg-white p-4 shadow-sm md:p-5">
                        <SingleJobDetailHome
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
                    <Modal.Header closeButton className="border-b border-gray-100 p-3">
                        <div className="text-sm font-semibold text-gray-800">{t("JobDetails")}</div>
                    </Modal.Header>
                    <Modal.Body className="p-0">
                        <div className="max-h-[80vh] overflow-y-auto px-3 py-3">
                            <SingleJobDetailHome
                                job={selectedJob}
                                logoImage={selectedJob?.logoImage}
                                onBack={() => setSelectedJob(null)}
                                searchFilters={filters}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="flex items-center justify-end gap-2 bg-gray-50 px-4 py-3">
                        <Button
                            appearance="subtle"
                            className="border border-gray-200 !text-gray-700 hover:!bg-gray-100"
                            onClick={() => setSelectedJob(null)}
                        >
                            {t("modalClose")}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default JobCardDetails;
