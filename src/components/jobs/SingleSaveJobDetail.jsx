"use client";
import noPostImage from "@/assets/feed/no-post.svg";
import BookEducation from "@/assets/svg/jobs/BookEducation";
import ClockSvg from "@/assets/svg/jobs/ClockSvg";
import Dollar from "@/assets/svg/jobs/Dollar";
import Experience from "@/assets/svg/jobs/Experience";
import Graph from "@/assets/svg/jobs/Graph";
import PeopleSvg from "@/assets/svg/jobs/PeopleSvg";
import { useRouter } from "@/i18n/navigation";
import useAppliedJobStore from "@/store/appliedJob.store";
import useJobStore from "@/store/job.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoClipboardOutline, IoMailOutline } from "react-icons/io5";
import { LuBookmark } from "react-icons/lu";
import { toast } from "react-toastify";
import { removeJob } from "../../api/job.api";
import Bar from "../../assets/svg/jobs/Bar";
import Colors from "../../assets/svg/jobs/colors";
import ImageFallback from "../../common/shared/ImageFallback";
import getImg from "../../lib/getImg";
import Image from "next/image";
import galleryIcon from "@/assets/gallery.png";
const SingleSaveJobDetail = ({ job, onBack }) => {
  // if (!job) return <div>Loading job details...</div>;
  const t = useTranslations("Jobs");
  const [bookmarked, setBookmarked] = useState(true); // Default to true since this is for saved jobs
  const [hasApplied, setHasApplied] = useState(false);
  const saveJob = useJobStore((s) => s.saveJob);
  const savedJobs = useJobStore((s) => s.savedJobs);
  const appliedJobs = useAppliedJobStore((s) => s.appliedJobs);
  const router = useRouter();

  // Check if this job is already saved when component mounts or job changes
  useEffect(() => {
    if (job && savedJobs && Array.isArray(savedJobs)) {
      const isAlreadySaved = savedJobs.some(
        (savedJob) =>
          savedJob.jobId === job._id ||
          savedJob._id === job._id ||
          (job.savedId && savedJob.savedId === job.savedId)
      );
      setBookmarked(isAlreadySaved);
    }
  }, [job, savedJobs]);

  // Check if user has already applied to this job
  useEffect(() => {
    if (job && appliedJobs && Array.isArray(appliedJobs)) {
      const isAlreadyApplied = appliedJobs.some(
        (appliedJob) => appliedJob.jobId?._id === job._id || appliedJob.jobId === job._id
      );
      setHasApplied(isAlreadyApplied);
    }
  }, [job, appliedJobs]);

  const toggleBookmark = () => {
    const userId = Cookies.get("userId");
    if (!userId) {
      toast.error(t("Usernotloggedin"));
      return;
    }

    if (bookmarked) {
      // 🔁 Call removeJob API
      removeJob({ jobId: job?._id, userId })
        .then(() => {
          toast.success(t("Jobremoved"));
          setBookmarked(false);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || t("Failedtosavejob"));
        });
    } else {
      // Save the job only if not already bookmarked
      saveJob({
        jobId: job?._id,
        userId,
        onSuccess: () => {
          toast.success(t("Jobsaved"));
          setBookmarked(true);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || t("Failedtosavejob"));
        },
      });
    }
  };

  const handleApplyNow = () => {
    // const locale = window.location.pathname.split("/")[1];
    router.push(`/jobs/apply-now/${job?._id}/${job?.title}`);
  };

  const handleApplyLink = () => {
    if (job?._raw?.careerWebsite) {
      window.open(job?._raw?.careerWebsite, "_blank");
    } else {
      toast.error("No career website link available");
    }
  };

  return (
    <div className="mt-5 w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:mt-0">
      {/* <button
        className="text-sm text-blue-600 underline mb-3"
        onClick={onBack}
      >
        ← Back to job list
      </button> */}

      <h3 className="mb-2 flex justify-between gap-2 text-lg font-semibold text-black">
        <div className="w-full max-w-[90%] text-lg break-words whitespace-normal">{job?.title}</div>
        <span onClick={toggleBookmark} className="shrink-0 cursor-pointer">
          {bookmarked ? (
            <FaBookmark className="text-xl text-[#888DA8]" />
          ) : (
            <LuBookmark className="text-xl text-[#888DA8]" />
          )}
        </span>
      </h3>

      <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">
        <IoClipboardOutline className="h-4 w-4" />
        {job?.experience}
      </div>
      <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">
        <HiOutlineLocationMarker className="h-4 w-4" />
        {job?.location}
      </div>
      <div>
        {job?._raw?.applyVia && (
          <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">
            <IoMailOutline className="h-4 w-4" />
            <a
              href={`mailto:${job?._raw?.applyVia}`}
              className="cursor-pointer underline hover:text-blue-800 hover:underline"
            >
              {job?._raw?.applyVia}
            </a>
          </div>
        )}
      </div>
      <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">
        {/* <Colors width={13} height={13} /> */}
        <div className="mb-2 flex items-center gap-3 text-sm text-[#888DA8]">
          {job?.genderPrefereance === "lgbtq" && (
      <Image
        src={galleryIcon}
        alt="LGBTQ friendly"
        width={22}
        height={22}
        className="inline-block"
      />
    )}
          {job?.genderPrefereance === "nonlgbtq" && <Bar className="h-5 w-5" />}
          <span>{job?.genderPrefereance}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className={`mt-3 rounded px-4 py-1.5 text-sm font-medium text-white ${hasApplied ? "cursor-not-allowed bg-gray-400" : "bg-green-700 hover:bg-green-800"
            }`}
          onClick={handleApplyNow}
          disabled={hasApplied}
        >
          {hasApplied ? t("alreadyApplied") : t("ApplyNow")}
        </button>
        {job?._raw?.careerWebsite && (
          <button
            className="mt-3 rounded bg-green-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-800"
            onClick={handleApplyLink}
          >
            {t("ApplyOncompany")}
          </button>
        )}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-gray-700">
        <h4 className="mb-2 font-medium">Quick Info Section</h4>
        <ul className="space-y-2 text-sm text-[#888DA8]">
          <li className="flex items-center gap-2">
            <ClockSvg />
            <span className="leading-relaxed break-words">{job?.type}</span>
          </li>
          <li className="flex items-center gap-2">
            <Experience />
            <span className="leading-relaxed break-words">{t("experience")}: {job?.experience}</span>
          </li>
          <li className="flex items-center gap-2">
            <BookEducation />
            <span className="leading-relaxed break-words">{t("Education")}: {job?.education}</span>
          </li>
          <li className="flex items-center gap-2">
            <Dollar />
            <span className="leading-relaxed break-words">{t("Salary")}: {job?.salary}</span>
          </li>
          <li className="flex items-center gap-2">
            <Graph />
            <span className="leading-relaxed break-words">{t("Seniority")}: {job?.seniority}</span>
          </li>
          <li className="flex items-center gap-2">
            <PeopleSvg />
            <span className="leading-relaxed break-words">{t("Applicants")}: {job?.applicants}</span>
          </li>
        </ul>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-[#888DA8]">
        <h4 className="mb-2 font-medium text-black">{t("JobDescription")}</h4>
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job?.description }} />
        <div
          className="mt-2 prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: job?.responsibilities }}
        />
        <div className="mt-4 border-t border-slate-100 pt-3">
          <h4 className="mb-2 font-medium text-black">{t("JobResponsibilities")}</h4>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job?.responsibilities }} />
        </div>
        <div className="mt-4 border-t border-slate-100 pt-3">
          <h4 className="mb-2 font-medium text-black">{t("JobRequirements")}</h4>
          <ul className="mt-2 grid max-w-full list-disc grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.isArray(job?.requiredSkills) &&
              job.requiredSkills.map((skill, i) => (
                <li key={i} className="flex items-center">
                  <span className="w-full rounded-lg bg-[#EAEAEA] px-3 py-2 text-center text-xs text-[13px] font-medium text-black shadow-sm transition-colors duration-200 hover:bg-green-100">
                    {skill}
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <div className="mt-3 flex flex-col items-start gap-2 border-t border-slate-100 pt-3 sm:flex-row">
            <div 
              className="cursor-pointer"
              onClick={() => {
                if (job?._raw?.companyId?._id) {
                  router.push(`/company/single-company/${job?._raw?.companyId?._id}?fromNetworkInvites=true`);
                }
              }}
            >
              <ImageFallback
                src={job?.logoImage ? getImg(job?.logoImage) : undefined}
                fallbackSrc={noPostImage}
                alt="logo"
                width={28}
                height={28}
                className="mt-1 rounded-md hover:opacity-80 transition-opacity"
              />
            </div>
            <div className="flex w-full flex-col">
              <div className="text-sm text-gray-500 leading-relaxed break-words cursor-pointer"  onClick={() => {
                if (job?._raw?.companyId?._id) {
                  router.push(`/company/single-company/${job?._raw?.companyId?._id}?fromNetworkInvites=true`);
                }
              }}>{job.company || "Unknown Company"} </div>
              <div className="w-full max-w-full text-[13px] break-words whitespace-normal leading-relaxed cursor-pointer" onClick={() => {
                if (job?._raw?.companyId?._id) {
                  router.push(`/company/single-company/${job?._raw?.companyId?._id}?fromNetworkInvites=true`);
                }
              }}>
                {job.website}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSaveJobDetail;
