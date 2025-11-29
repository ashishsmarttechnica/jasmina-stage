"use client";

import SingleJobDetail from "./SingleJobDetail";
import { useSingleJob } from "@/hooks/job/useGetJobs";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const mapJobToDetail = (job, t) => {
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
    totalShare: job?.totalShare || 0,
    _raw: job,
  };
};

const SharedJobDetail = ({ jobId }) => {
  const t = useTranslations("Jobs");
  const { data, isLoading, isError, error } = useSingleJob(jobId);

  const job = data?.data;

  const mappedJob = useMemo(() => {
    if (!job) return null;
    return mapJobToDetail(job, t);
  }, [job, t]);

  if (isLoading) {
    return (
      <div className="rounded-lg mt-5 p-4 text-sm text-gray-600 shadow-sm">
        {t("loadingJobs")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error?.message || t("errorLoadingJobs")}
      </div>
    );
  }

  if (!mappedJob) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
        {t("noJobsMatchingCriteria")}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <SingleJobDetail
        job={mappedJob}
        logoImage={mappedJob.logoImage}
        hideApplyButton={false}
        onBack={null}
      />
    </div>
  );
};

export default SharedJobDetail;

