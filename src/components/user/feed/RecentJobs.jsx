"use client";
import noPostImage from "@/assets/feed/no-post.svg";
import CardHeading from "@/common/card/CardHeading";
import ImageFallback from "@/common/shared/ImageFallback";
import useGetResentJob from "@/hooks/job/useGetResentJob";
import { useRouter } from "@/i18n/navigation";
import getImg from "@/lib/getImg";
import galleryIcon from "@/assets/gallery.png";
// import useResentJobStore from "@/store/resentjob.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoClipboardOutline } from "react-icons/io5";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { getRelativeTime } from "../../../utils/dateUtils";
import Image from "next/image";

const RecentJobs = memo(() => {
  const t = useTranslations("UserFeedPost");
  const userId = Cookies.get("userId");
  const { data, isLoading, error } = useGetResentJob(userId);
  // const { resentJobs } = useResentJobStore();
  const router = useRouter();
  // console.log(data, isLoading, error, "recent/job");

  const handleJobCardClick = () => {
    router.push(`/jobs`);
  };

  return (
    <div className="cust-card">
      <div className="flex items-center justify-between">
        <CardHeading title={t("recentjob")} />
      </div>

      <div className="mx-auto overflow-hidden p-5">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>
            <p className="text-center text-red-500">
              {/* {error?.message || "Failed to load suggestions"} */}
            </p>
          </div>
        ) : (
          <Swiper spaceBetween={10} slidesPerView="auto" className="h-full">
            {data?.data?.recentJobs?.map((job, index) => (
              <SwiperSlide key={job._id || index} className="z-5 !w-auto">
                <div className="border-grayBlueText/50 z-5 h-auto w-auto min-w-[172px] overflow-hidden rounded-md border px-0 shadow-sm">
                  <div
                    className="block justify-between bg-white p-2.5 text-left transition-all hover:shadow"
                    onClick={() => handleJobCardClick()}
                  >
                    <h3 className="mb-2 line-clamp-2 h-[25px] max-w-full text-base leading-[21px] font-bold tracking-normal text-black leading-relaxed break-words">
                      {job.jobTitle}
                    </h3>
                    <p className="text-grayBlueText mb-2.5 flex items-center gap-2 text-sm">
                      <IoClipboardOutline className="h-4 w-4" />
                      <span className="leading-relaxed break-words">{job.experience} Year</span>
                    </p>
                    <p className="text-grayBlueText mb-4 flex items-center gap-2 text-sm">
                      <HiOutlineLocationMarker className="h-4 w-4" />
                      <span className="leading-relaxed break-words">{job.jobLocation}</span>
                    </p>
                    <p className="text-grayBlueText mt-3 text-xs font-normal">
                      {t("posted")} {getRelativeTime(job.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 border-t border-black/10 p-2.5 text-left">
                    <ImageFallback
                      src={job.companyId?.logoUrl ? getImg(job.companyId.logoUrl) : undefined}
                      fallbackSrc={noPostImage}
                      alt={job.companyId?.companyName || "Company Logo"}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full border border-gray-400 object-cover"
                    />
                    <div className="flex flex-col ">
                      <div className="flex items-center gap-2">
                      <h2 className="text-xs flex items-center gap-2 font-medium text-black leading-relaxed break-words">
                        {job.companyId?.companyName}
                      </h2>
                      
                        {job.companyId?.isLGBTQFriendly === true && (
                             <Image
                               src={galleryIcon}
                               alt="LGBTQ friendly"
                               width={22}
                               height={22}
                               className="inline-block"
                             />
                           )}
                           </div>
                      {job.companyId?.website && (  
                        <a
                          href={job.companyId.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#007BFF] leading-relaxed break-all"
                        >
                          {job.companyId.website}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
});
export default RecentJobs;
