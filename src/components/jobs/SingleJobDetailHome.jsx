"use client";
import noPostImage from "@/assets/feed/no-post.svg";
import galleryIcon from "@/assets/gallery.png";
import BookEducation from "@/assets/svg/jobs/BookEducation";
import ClockSvg from "@/assets/svg/jobs/ClockSvg";
import Dollar from "@/assets/svg/jobs/Dollar";
import Experience from "@/assets/svg/jobs/Experience";
import Graph from "@/assets/svg/jobs/Graph";
import PeopleSvg from "@/assets/svg/jobs/PeopleSvg";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoClipboardOutline, IoMailOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Share from "../../assets/svg/feed/Share";
import Bar from "../../assets/svg/jobs/Bar";
import ImageFallback from "../../common/shared/ImageFallback";
import getImg from "../../lib/getImg";

// Lightweight version for home/search pages – no bookmark / apply logic
const SingleJobDetailHome = ({ job, logoImage }) => {
  const t = useTranslations("Jobs");
  const locale = useLocale();
  const router = useRouter();
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [totalShare, setTotalShare] = useState(job?.totalShare || 0);

  const handleApplyNow = () => {
    router.push(`/jobs/apply-now/${job?._id}/${job?.title}`);
  };

  const copyToClipboard = async (text) => {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const buildShareUrl = (id) => {
    if (typeof window === "undefined" || !id) return "";
    const origin = window.location.origin || "";
    return `${origin}/${locale}/jobs/${id}`;
  };

  const handleShare = async (id) => {
    const shareUrl = buildShareUrl(id);
    if (!shareUrl) {
      toast.error("Unable to generate share link");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title || "Check out this job!",
          text:
            job?.description?.replace(/<[^>]+>/g, "")?.slice(0, 100) ||
            "Amazing job opportunity!",
          url: shareUrl,
        });
        setTotalShare((prev) => prev + 1);
        toast.success("Job shared successfully");
        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copyToClipboard(shareUrl);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Share fallback failed:", error);
      toast.error("Share unsupported");
    }
  };

  if (!job) {
    return (
      <div className="mt-5 w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-5 md:mt-0 animate-pulse">
        {/* Title skeleton */}
        <div className="mb-2 flex justify-between px-2">
          <div className="h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="h-5 w-5 rounded bg-gray-200"></div>
        </div>

        {/* Experience skeleton */}
        <div className="mb-2 flex gap-3">
          <div className="h-4 w-4 rounded bg-gray-200"></div>
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </div>

        {/* Location skeleton */}
        <div className="mb-2 flex gap-3">
          <div className="h-4 w-4 rounded bg-gray-200"></div>
          <div className="h-4 w-40 rounded bg-gray-200"></div>
        </div>

        {/* Apply button skeleton */}
        <div className="mt-3 h-9 w-32 rounded bg-gray-200"></div>

        {/* Quick Info Section skeleton */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="mb-2 h-5 w-32 rounded bg-gray-200"></div>
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-200"></div>
                <div className="h-4 w-40 rounded bg-gray-200"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* Job Description skeleton */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="mb-2 h-5 w-32 rounded bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Company info skeleton */}
        <div className="mt-3 flex items-start gap-2 border-t border-slate-100 pt-3">
          <div className="h-7 w-7 rounded-md bg-gray-200"></div>
          <div className="flex w-full flex-col gap-1">
            <div className="h-4 w-32 rounded bg-gray-200"></div>
            <div className="h-3 w-40 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-5 md:mt-0">
      <h3 className="mb-2 flex justify-between px-2 text-lg font-semibold text-black">
        <div className="w-full max-w-[90%] text-lg break-words whitespace-normal">
          {job?.title}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleShare(job?._id)}
            disabled={isShareLoading}
            className={`share-btn px-2 text-xl ${isShareLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
            title="Share"
          >
            <Share width={18} height={18} className="text-[#888DA8]" />
          </button>
        </div>
      </h3>

      <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">
        <IoClipboardOutline className="h-4 w-4" />
        <span className="leading-relaxed break-words">{job?.experience}</span>
      </div>
      <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">
        <HiOutlineLocationMarker className="h-4 w-4" />
        <span className="leading-relaxed break-words">{job?.location}</span>
      </div>
      <div>
        {job?._raw?.applyVia && (
          <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">
            <IoMailOutline className="h-4 w-4" />
            <a
              href={`mailto:${job?._raw?.applyVia}`}
              className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline leading-relaxed break-all"
            >
              {job?._raw?.applyVia}
            </a>
          </div>
        )}
      </div>
      <div className="mb-2 flex gap-3 text-sm text-[#888DA8]">
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
          <span className="leading-relaxed break-words">
            {job?.genderPrefereance}
          </span>
        </div>
      </div>

      <button
        className="mt-3 rounded bg-green-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-800"
        onClick={handleApplyNow}
      >
        {t("applyNow")}
      </button>

      <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-gray-700">
        <h4 className="mb-2 font-medium">{t("QuickInfoSection")}</h4>
        <ul className="space-y-2 text-sm text-[#888DA8]">
          <li className="flex items-center gap-2">
            <ClockSvg />
            <span className="leading-relaxed break-words">{job?.type}</span>
          </li>
          <li className="flex items-center gap-2">
            <Experience />
            <span className="leading-relaxed break-words">
              {t("experience")}: {job?.experience}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <BookEducation />
            <span className="leading-relaxed break-words">
              {t("Education")}: {job?.education}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Dollar />
            <span className="leading-relaxed break-words">
              {t("Salary")}: {job?.salary}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Graph />
            <span className="leading-relaxed break-words">
              {t("Seniority")}: {job?.seniority}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <PeopleSvg />
            <span className="leading-relaxed break-words">
              {t("Applicants")}: {job?.applicants}
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-[#888DA8]">
        <h4 className="mb-2 font-medium text-black">{t("JobDescription")}</h4>
        <div className="leading-relaxed job-description text-gray-700">
          {job.description ? (
            <div className="w-full max-w-[100%] text-lg break-words whitespace-normal">
              {job.description.includes("<") ? (
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              ) : (
                <p className="w-full max-w-[100%] text-sm break-words whitespace-normal">
                  {job.description}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No description available</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col items-start gap-2 border-t border-slate-100 pt-3 sm:flex-row">
        <div
          className="cursor-pointer"
          onClick={() => {
            if (job?._raw?.companyId?._id) {
              router.push(
                `/company/single-company/${job?._raw?.companyId?._id}?fromNetworkInvites=true`
              );
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
          <div
            className="text-sm text-gray-500 leading-relaxed break-words cursor-pointer"
            onClick={() => {
              if (job?._raw?.companyId?._id) {
                router.push(
                  `/company/single-company/${job?._raw?.companyId?._id}?fromNetworkInvites=true`
                );
              }
            }}
          >
            {job.company || "Unknown Company"}{" "}
          </div>
          <div
            className="w-full max-w-full text-[13px] break-words whitespace-normal leading-relaxed cursor-pointer"
            onClick={() => {
              if (job?._raw?.companyId?._id) {
                router.push(
                  `/company/single-company/${job?._raw?.companyId?._id}?fromNetworkInvites=true`
                );
              }
            }}
          >
            {job.website}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleJobDetailHome;


