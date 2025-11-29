"use client";

import noPost from "@/assets/feed/no-post.svg";
import noImage2 from "@/assets/form/noImage2.svg";
import Comment from "@/assets/svg/feed/Comment";
import Like from "@/assets/svg/feed/Like";
import Share from "@/assets/svg/feed/Share";
import ImageFallback from "@/common/shared/ImageFallback";
import getImg from "@/lib/getImg";

import FillLike from "@/assets/svg/feed/FillLike";
import LoaderIcon from "@/assets/svg/feed/LoaderIcon";
import { useLikePost, usePostShare, useUnlikePost } from "@/hooks/post/usePosts";
import { useRouter } from "@/i18n/navigation";
import LikeUserModel from "@/modal/LikeUserModel";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "swiper/css";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PostSlider({ posts, userData }) {
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={10}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1.2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 1.5,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          1536: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        className="px-1 !pb-10 sm:px-2 md:px-4"
      >
        {posts.map((post) => (
          <SwiperSlide
            key={post._id}
            className="shadow-card border-secondary/20 !w-full border sm:!w-[300px] md:!w-[365px]"
          >
            <PostCardSingle post={post} userData={userData} />
          </SwiperSlide>
        ))}
        <div slot="container-end">
          {/* <CustomSwiperNavigation totalSlides={postData.length} /> */}
        </div>
      </Swiper>
    </div>
  );
}

function PostCardSingle({ post, userData }) {
  const [showMore, setShowMore] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const { mutate: sharePost, isLoading: isShareLoading } = usePostShare();
  const { mutate: likePost, isLoading: isLiking } = useLikePost();
  const { mutate: unlikePost, isLoading: isUnliking } = useUnlikePost();
  const locale = useLocale();
  const router = useRouter();
  const descRef = useRef(null);

  // Update local post when prop changes
  useEffect(() => {
    setLocalPost(post);
  }, [post]);
  const t = useTranslations("CompanyProfile");

  // Mirror DynamicPost like-state handling to keep counts in sync
  const updateLocalPostLikeState = (userId, isLike = true) => {
    setLocalPost((prev) => {
      if (!prev) return prev;

      if (!userId) {
        return {
          ...prev,
          isLiked: isLike,
          isLike,
          totalLike: isLike ? (prev.totalLike || 0) + 1 : Math.max((prev.totalLike || 0) - 1, 0),
        };
      }

      const likedBy = prev.likedBy || [];
      const alreadyLiked = likedBy.includes(userId);
      let totalLike = prev.totalLike || 0;
      let nextLikedBy = likedBy;

      if (isLike) {
        if (!alreadyLiked) {
          totalLike += 1;
          nextLikedBy = [...likedBy, userId];
        }
      } else if (alreadyLiked) {
        totalLike = Math.max(totalLike - 1, 0);
        nextLikedBy = likedBy.filter((id) => id !== userId);
      }

      return {
        ...prev,
        isLiked: isLike,
        isLike,
        totalLike,
        likedBy: nextLikedBy,
      };
    });
  };

  const handleLike = (id) => {
    if (isLiking) return;

    likePost(id, {
      onSuccess: (response) => {
        if (response?.success) {
          updateLocalPostLikeState(response.data?.userId, true);
          // toast.success(response.message || "Post liked successfully!");
        } else {
          // toast.error(response?.message || "Failed to like post");
        }
      },
      onError: (error) => {
        // toast.error(error?.response?.data?.message || "Failed to like post");
      },
    });
  };

  const handleUnlike = (id) => {
    if (isUnliking) return;

    unlikePost(id, {
      onSuccess: (response) => {
        if (response?.success) {
          updateLocalPostLikeState(response.data?.userId, false);
          // toast.success("Post unliked successfully!");
        } else {
          // toast.error(response?.message || "Failed to unlike post");
        }
      },
      onError: (error) => {
        // toast.error(error?.response?.data?.message || "Failed to unlike post");
      },
    });
  };

  const handleOpenLikesModal = (event) => {
    event.stopPropagation();
    setIsLikeModalOpen(true);
  };

  const handleShare = async (id) => {
    if (isShareLoading) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post!",
          text: localPost?.postDesc || "Amazing post!",
          url: `${window.location.origin}/${locale}/post/${id}`,
        });

        // Call share API and update count on success
        sharePost(id, {
          onSuccess: (response) => {
            if (response?.success) {
              // Update local state with new share count
              setLocalPost((prev) => ({
                ...prev,
                totalShare: (prev.totalShare || 0) + 1,
              }));
              toast.success(t("Postsharedsuccessfully"));
            } else {
              toast.error(response?.message || t("Failedtosharepost"));
            }
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || t("Failedtosharepost"));
          },
        });
      } catch (error) {
        // Only show error if it's not a user cancellation
        if (error.name !== "AbortError") {
          // console.log(error);
          toast.error(t("Sharecancelledorfailed"));
        }
      }
    } else {
      toast.info(t("Shareunsupported"));
    }
  };

  useEffect(() => {
    const element = descRef.current;
    if (element) {
      // Check if content overflows
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [post?.postDesc]);

  const isLocalPostLiked = localPost?.isLiked ?? localPost?.isLike ?? false;

  return (
    <>
      <LikeUserModel
        isOpen={isLikeModalOpen}
        onClose={() => setIsLikeModalOpen(false)}
        post={localPost}
      />
      <div className="rounded-[5px] bg-white h-[552px] flex flex-col ">

        {/* User Info */}
        <div className="flex items-center gap-2.5 border-b border-black/10 px-[17px] py-[17px]">
          <div className="relative h-10 w-10">
            <ImageFallback
              src={userData?.profile?.photo && getImg(userData?.profile?.photo || noImage2)}
              fallbackSrc={noImage2}
              width={40}
              height={40}
              priority={true}
              alt={userData?.profile?.fullName ?? "user"}
              className="mb-[25px] h-10 w-10 rounded-full object-cover"
              style={{ height: "auto" }}
            />
          </div>
          <div className="min-w-0 text-left">
            <p className="truncate text-[13px] font-medium leading-relaxed break-words">{userData?.profile?.fullName}</p>
            <p className="text-grayBlueText truncate text-xs font-normal leading-relaxed break-words">
              {userData?.preferences?.jobRole}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-3 sm:p-[17px] h-[420px]">
          <div className="min-h-[3rem] sm:min-h-[3.5rem]">
            <p
              ref={descRef}
              className={`text-grayBlueText text-[12px] font-normal sm:text-[13px] leading-relaxed break-words ${showMore ? "" : localPost?.postImg ? "showline-2" : "showline-10"
                }`}
            >
              {localPost?.postDesc}
            </p>

            {!showMore && isTruncated && (
              <button
                className="text-primary mt-1 text-[11px] underline sm:text-xs"
                onClick={() => router.push(`/post/${localPost._id}`)}
              >
                {t("ReadMore")}
              </button>
            )}
          </div>


          {localPost?.postImg && (
            <div className="relative flex min-h-[250px] w-full items-center justify-center sm:min-h-[330px]">
              <ImageFallback
                src={getImg(localPost?.postImg)}
                fallbackSrc={noPost}
                width={335}
                height={335}
                alt={userData?.profile?.fullName ?? "user"}
                priority={true}
                className="h-full w-full object-cover sm:max-h-[335px] rounded-lg"
              />
            </div>
          )}
        </div>


        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/10 p-3 text-[12px] text-gray-500 sm:p-[17px] sm:text-[13px]">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {isLocalPostLiked ? (
              <span
                className={`flex items-center gap-1 ${isUnliking ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                onClick={() => handleUnlike(localPost._id)}
              >
                {isUnliking ? <LoaderIcon /> : <FillLike />}{" "}
                <span
                  onClick={handleOpenLikesModal}
                  className="font-medium hover:text-primary hover:cursor-pointer hover:underline"
                  role="button"
                >
                  {localPost.totalLike || 0}
                </span>
              </span>
            ) : (
              <span
                className={`flex items-center gap-1 ${isLiking ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                onClick={() => handleLike(localPost._id)}
              >
                {isLiking ? <LoaderIcon /> : <Like />}{" "}
                <span
                  onClick={handleOpenLikesModal}
                  className="font-medium hover:text-primary"
                  role="button"
                >
                  {localPost.totalLike || 0}
                </span>
              </span>
            )}
            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={() => router.push(`/post/${localPost._id}`)}
            >
              <Comment /> {localPost.totalComment || 0}
            </div>
            <span
              className={`flex items-center gap-1 ${isShareLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              onClick={() => handleShare(localPost._id)}
            >
              {isShareLoading ? <LoaderIcon /> : <Share />} {localPost.totalShare || 0}
            </span>
          </div>
          <span className="text-grayBlueText text-xs font-normal whitespace-nowrap">
            {localPost.timeAgo}
          </span>
        </div>
      </div>
    </>
  );
}
