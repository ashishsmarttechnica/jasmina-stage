import noImage2 from "@/assets/feed/no-img.png";
import ImageFallback from "@/common/shared/ImageFallback";
import { useRouter } from "@/i18n/navigation";
import getImg from "@/lib/getImg";
import useAuthStore from "@/store/auth.store";
import useResentJobStore from "@/store/resentjob.store";
import useSingleCompanyAppliedJobStore from "@/store/singleCopanyAppliedJob.store";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoClipboardOutline } from "react-icons/io5";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import useSingleCompanyAppliedJob from "../../../../hooks/company/singleCompany/useSingleCompanyAppliedJob";
import galleryIcon from "@/assets/gallery.png";
import Image from "next/image";
const JobTab = () => {
  const t = useTranslations("CompanyProfile.singleCompanyTab");
  const router = useRouter();
  // const { data, isLoading, error } = useGetResentJob();
  const { resentJobs } = useResentJobStore();
  // console.log(data, isLoading, error, "recent/job");
  const params = useParams();
  // const { data: userData, isLoading, error } = useSingleCompany(userId);

  const {
    data: getCompanyAppliedJob,
    isLoading: isGetCompanyAppliedJobLoading,
    isError: isGetCompanyAppliedJobError,
    error: getCompanyAppliedJobError,
  } = useSingleCompanyAppliedJob(params.id);
  const jobListings = getCompanyAppliedJob;
  const { user } = useAuthStore();
  const userId = user?._id;

  // Get the setSelectedJob function from the store
  const setSelectedJob = useSingleCompanyAppliedJobStore((state) => state.setSelectedJob);

  const handleApplyNow = () => {
    // const locale = window.location.pathname.split("/")[1];
    router.push(`/jobs/apply-now/${jobListings?._id}/${jobListings?.jobTitle}`);
  };

  // Add click handler for job cards
  const handleJobCardClick = (job) => {
    setSelectedJob(job); // Store the selected job data in the store

    // Check if URL contains fromConnections=true or fromNetworkInvites=true
    const urlParams = new URLSearchParams(window.location.search);
    const fromConnections = urlParams.get("fromConnections");
    const fromNetworkInvites = urlParams.get("fromNetworkInvites");

    // Only navigate if neither fromConnections nor fromNetworkInvites is true
    if (fromConnections !== "true" && fromNetworkInvites !== "true") {
      router.push(`/company/single-company/${userId}/applications/${job._id}`);
    }
  };

  return (
    <div className="cust-card">
      {/* */}
      <div className="mx-auto overflow-hidden p-6">
        {isGetCompanyAppliedJobLoading ? (
          <div className="py-10 text-center text-gray-500">Loading jobs...</div>
        ) : isGetCompanyAppliedJobError ? (
          <div className="py-10 text-center text-slate-500">
            {getCompanyAppliedJobError?.message || "Failed to load jobs."}
          </div>
        ) : Array.isArray(jobListings) && jobListings.length > 0 ? (
          <Swiper spaceBetween={20} slidesPerView="auto" className="h-full">
            {jobListings?.map((job, index) => (
              <SwiperSlide key={index} className="z-5 !w-auto">
                <div
                  className="border-grayBlueText/50 z-5 flex h-[199px] w-[180px] min-w-[180px] cursor-pointer flex-col justify-between overflow-hidden rounded-md border px-0 shadow-sm transition-all hover:shadow-md"
                  onClick={() => handleJobCardClick(job)}
                >
                  <div className="block bg-white p-2.5 text-left transition-all hover:shadow">
                    <h3 className="mb-2 line-clamp-2 h-[25px] max-w-full text-base leading-[21px] leading-relaxed font-bold tracking-normal break-words text-black">
                      {job.jobTitle}
                    </h3>
                    <p className="text-grayBlueText flex items-center gap-2 text-sm">
                      <IoClipboardOutline className="h-4 w-4" />
                      <span className="leading-relaxed break-words">
                        {job.experience || job.seniorityLevel} year
                      </span>
                    </p>
                    <p className="text-grayBlueText mb-4 flex h-[20px] max-w-[130px] items-center gap-2 truncate text-sm whitespace-nowrap">
                      <HiOutlineLocationMarker className="h-4 w-4" />
                      <span className="leading-relaxed break-words">
                        {(() => {
                          const words = (job.jobLocation || "").split(" ");
                          return words.length > 16
                            ? words.slice(0, 16).join(" ") + "..."
                            : job.jobLocation;
                        })()}
                      </span>
                    </p>
                    <p className="text-grayBlueText mt-3 text-xs font-normal">
                      posted {job.createdAt && new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Conditional rendering for Apply Now or Company Info */}
                  {user?.role === "user" ? (
                    <div className="flex items-center gap-1.5 border-t border-black/10 p-2.5 text-left">
                      <a
                        // href={job.careerWebsite || "#"}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click when clicking Apply Now
                          handleApplyNow();
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary rounded px-4 py-1 text-center text-white"
                      >
                        Apply Now
                      </a>
                    </div>
                  ) : user?.role === "company" ? (
                    <div className="flex items-center gap-1.5 border-t border-black/10 p-2.5 text-left">
                      <ImageFallback
                        src={job?.companyId?.logoUrl && getImg(job?.companyId?.logoUrl)}
                        fallbackSrc={noImage2}
                        alt={job?.companyId?.companyName || "company"}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full border border-gray-400 object-cover"
                      />
                      <div className="flex flex-col">
                        <h2 className="text-xs leading-relaxed font-medium break-words text-black">
                          {job.companyId?.companyName}
                          {job?.isLGBTQFriendly === true && (
                            <Image
                              src={galleryIcon}
                              alt="LGBTQ friendly"
                              width={22}
                              height={22}
                              className="inline-block"
                            />
                          )}
                        </h2>
                        <a
                          href={job.companyId?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] leading-relaxed break-all text-[#007BFF]"
                          onClick={(e) => e.stopPropagation()} // Prevent card click when clicking website link
                        >
                          {job.companyId?.website}
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="py-10 text-center text-gray-500">No jobs found for this company.</div>
        )}
      </div>
    </div>
  );
};

export default JobTab;
