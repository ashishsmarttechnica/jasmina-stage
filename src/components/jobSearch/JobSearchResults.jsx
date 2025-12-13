"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JobHeaderHome from "../jobs/jobHeaderHome";
import JobCardDetails from "./JobCardDetails";

const JobSearchResults = ({
    jobs,
    loading,
    error,
    search,
    location,
    lgbtq,
    totalJobs,
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const t = useTranslations("Jobs");
    const router = useRouter();
    const [filters, setFilters] = useState({
        search: search || "",
        location: location || "",
        lgbtq: lgbtq || false,
    });

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            search: search || "",
            location: location || "",
            lgbtq: lgbtq || false
        }));
    }, [search, location, lgbtq]);

    const handleFindJob = (newFilters) => {
        const params = new URLSearchParams();
        if (newFilters.search) params.set("search", newFilters.search);
        if (newFilters.location) params.set("location", newFilters.location);
        if (newFilters.lgbtq) params.set("lgbtq", newFilters.lgbtq);
        router.push(`?${params.toString()}`);
    };

    const handleApplyNow = (event, job) => {
        event.stopPropagation();

        const titleSlug = (job?.jobTitle || "job")
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        router.push(`/jobs/apply-now/${job?._id}/${titleSlug || "job"}`);
    };




    if (loading && jobs.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header skeleton */}
                    <div className="mb-4 animate-pulse">
                        <div className="h-16 w-full rounded-lg bg-white/90 shadow-sm"></div>
                    </div>

                    {/* Result summary skeleton */}
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between animate-pulse">
                        <div className="space-y-2">
                            <div className="h-4 w-40 rounded bg-gray-200"></div>
                            <div className="h-4 w-56 rounded bg-gray-200"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-6 w-24 rounded-full bg-gray-200"></div>
                            <div className="h-6 w-28 rounded-full bg-gray-200"></div>
                        </div>
                    </div>

                    {/* Job cards skeleton */}
                    <div className="rounded-2xl bg-white/90 p-3 shadow-sm ring-1 ring-slate-100 sm:p-4 animate-pulse">
                        <div className="flex w-full flex-col gap-4 md:flex-row">
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
                            <div className="w-full md:w-[62%]">
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    const handleJobClick = (jobId) => {
        router.push(`/job/${jobId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Job Header */}
                <div className="mb-4">
                    <JobHeaderHome
                        filters={filters}
                        setFilters={setFilters}
                        onFindJob={handleFindJob}
                    />
                </div>

                {/* Result summary & active filters */}
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                            {t("JobSearchResults")}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                            {totalJobs > 0 ? (
                                <>
                                    {t("Found")}{" "}
                                    <span className="font-semibold text-gray-900">{totalJobs}</span>{" "}
                                    {t("jobsMatchingCriteria")}
                                </>
                            ) : (
                                <span className="text-gray-500">{t("noJobsMatchingCriteria")}</span>
                            )}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        {search && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
                                <span className="font-semibold">{t("Search")}:</span> {search}
                            </span>
                        )}
                        {location && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                                <span className="font-semibold">{t("location")}:</span> {location}
                            </span>
                        )}
                        {lgbtq === "true" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-100">
                                {t("lgbtqFriendly")}
                            </span>
                        )}
                    </div>
                </div>


                <div className="rounded-2xl bg-white/90 p-3 shadow-sm ring-1 ring-slate-100 sm:p-4">
                    <JobCardDetails
                        filters={filters}
                        jobs={jobs}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
};

export default JobSearchResults;
