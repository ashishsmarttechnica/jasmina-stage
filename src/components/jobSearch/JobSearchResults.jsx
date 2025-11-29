"use client";
import noImage2 from "@/assets/feed/no-img.png";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBriefcase, FaBuilding, FaClock, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { LuBookmark } from "react-icons/lu";
import { MdWorkOutline } from "react-icons/md";
import ImageFallback from "../../common/shared/ImageFallback";
import JobHeader from "../jobs/JobHeader";

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
    const t = useTranslations();
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




    if (loading && jobs.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow h-48"></div>
                        ))}
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}


                {/* Job Header */}
                <div className="mb-6">
                    <JobHeader
                        filters={filters}
                        setFilters={setFilters}
                        onFindJob={handleFindJob}
                    />
                </div>
                <div className="flex items-center  gap-3">
                    <p className="text-md font-medium text-gray-900 mb-2">Job Search Results </p>
                    <div className="flex flex-wrap gap-2 mb-1  text-gray-600">
                        {search && (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Search: {search}
                            </span>
                        )}
                        {location && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Location: {location}
                            </span>
                        )}
                        {lgbtq === "true" && (
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                LGBTQ Friendly
                            </span>
                        )}
                    </div>
                </div>
                <p className="my-3 text-gray-600">
                    Found <span className="font-semibold text-gray-900">{totalJobs}</span> jobs
                </p>
                {/* Job Listings */}
                {jobs.length === 0 && !loading ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-gray-400 text-6xl mb-4">
                            <MdWorkOutline className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {jobs.map((job) => (
                            <div
                                key={job._id}
                                onClick={() => handleJobClick(job._id)}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-200 hover:border-primary"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Company Logo */}
                                    <div className="flex-shrink-0">
                                        <div className="rounded-full flex items-center justify-center overflow-hidden">
                                            {job.companyId?.logoUrl ? (
                                                <ImageFallback
                                                    src={`https://stageapi.joinjasmina.com/${job.companyId.logoUrl.replace(/\\/g, '/')}`}
                                                    loading="lazy"
                                                    // alt={job.companyId?.companyName || "Company"}
                                                    width={50}
                                                    height={50}
                                                    className="object-cover rounded-full"
                                                    fallbackSrc={noImage2}
                                                />
                                            ) : (
                                                <FaBuilding className="text-gray-400 text-3xl" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Job Details */}
                                    <div className="flex-1">
                                        {/* Title and Company */}
                                        <div className="mb-3">
                                            <h2 className="text-lg font-bold text-gray-900 mb-1 hover:text-primary transition-colors">
                                                {job.jobTitle}
                                            </h2>
                                            <p className="text-gray-700 text-sm font-medium flex items-center gap-2">
                                                <FaBuilding className="text-gray-500" />
                                                {job.companyId?.companyName || "Company Name"}
                                            </p>
                                        </div>

                                        {/* Job Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                                                <span className="text-sm truncate">
                                                    {job.jobLocation || "Location not specified"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaBriefcase className="text-green-500 flex-shrink-0" />
                                                <span className="text-sm capitalize">
                                                    {job.employeeType?.replace(/([A-Z])/g, ' $1').trim() || "Full Time"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaClock className="text-orange-500 flex-shrink-0" />
                                                <span className="text-sm capitalize">
                                                    {job.seniorityLevel?.replace(/-/g, ' ') || "Entry Level"}
                                                </span>
                                            </div>

                                            {job.salaryRange && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaMoneyBillWave className="text-purple-500 flex-shrink-0" />
                                                    <span className="text-sm">{job.salaryRange}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {job.description && (
                                            <div
                                                className="text-gray-600 text-sm line-clamp-2 mb-3"
                                                dangerouslySetInnerHTML={{ __html: job.description }}
                                            />
                                        )}

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {job.workMode && (
                                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                                    {job.workMode}
                                                </span>
                                            )}
                                            {job.department && (
                                                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium capitalize">
                                                    {job.department}
                                                </span>
                                            )}
                                            {job.negotiable && (
                                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                    Negotiable
                                                </span>
                                            )}
                                            {job.requiredSkills && job.requiredSkills.length > 0 && (
                                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                                    {job.requiredSkills[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Apply Button */}
                                    <div className="flex items-center lg:items-start">
                                        {/* <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleJobClick(job._id);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
                                        >
                                            View Details
                                        </button> */}
                                        <Link
                                            href="/jobs/save-jobs"
                                            className=""
                                        >
                                            <div className="flex items-center justify-between py-3">

                                                <div>
                                                    <button
                                                        className={`rounded px-4 py-1.5 text-sm font-medium text-white bg-green-700 hover:bg-green-800`}
                                                    // onClick={handleApplyNow}
                                                    // disabled={hasApplied}
                                                    >
                                                        Apply Now
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2.5 md:px-4 text-gray-500">
                                                    <LuBookmark className="text-2xl" />
                                                </div>
                                                {/* <span className="px-4 text-xs font-bold text-black d-hidden">{savedJobs.length}</span> */}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Load More Button */}
                        {jobs.length < totalJobs && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={loading}
                                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSearchResults;
