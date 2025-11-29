"use client";
import noPostImage from "@/assets/feed/no-post.svg";
import Comment from "@/assets/svg/feed/Comment";
import FillLike from "@/assets/svg/feed/FillLike";
import Like from "@/assets/svg/feed/Like";
import LoaderIcon from "@/assets/svg/feed/LoaderIcon";
import Share from "@/assets/svg/feed/Share";
import ImageFallback from "@/common/shared/ImageFallback";
import FeedComment from "@/components/user/feed/comment/FeedComment";
import { useLikePost, useUnlikePost } from "@/hooks/post/usePosts";
import { formatRelativeTime } from "@/lib/commondate";
import getImg from "@/lib/getImg";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const SinglePostFeed = ({ post }) => {
  if (!post) return null;
  const [showComments, setShowComments] = useState(false);
  const [shoeCommentBoxId, setShowCommentBoxId] = useState(null);
  const { mutate: likePost, isLoading: isLiking } = useLikePost();
  const { mutate: unlikePost, isLoading: isUnliking } = useUnlikePost();

  const fullName = post?.userId?.profile?.fullName || "Unknown User";
  const title = post?.userId?.preferences?.jobRole || "";
  const postTime = formatRelativeTime(post.createdAt);

  const handleShowComments = (id) => {
    setShowCommentBoxId(id);
    setShowComments((prev) => !prev);
  };
  const handleLike = (id) => {
    likePost(id);
  };
  const handleUnlike = (id) => {
    unlikePost(id);
  };
  return (
    <div className="shadow-card rounded-xl bg-white">
      <div className="flex items-center gap-2.5 border-b border-black/10 px-5 py-4 pb-[16px]">
        <div className="relative h-10 w-10">
          <ImageFallback
            src={post.userId?.profile?.photo && getImg(post.userId.profile.photo)}
            alt={fullName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>

        <div className="min-w-0 text-left">
          <p className="truncate text-[13px] font-medium leading-relaxed break-words">{fullName}</p>
          <p className="text-grayBlueText mt-0 truncate text-xs font-normal leading-relaxed break-words">{title}</p>
        </div>
      </div>
      <div className="px-6 py-1">
        <p className="text-grayBlueText pt-5 pb-4 sm:text-[13px] leading-[17px] font-normal tracking-normal leading-relaxed break-words text-[14px] ">
          {post.postDesc}{" "}
        </p>

        {post.postImg && (
          <div className="mb-4 overflow-hidden">
            <ImageFallback
              src={getImg(post.postImg)}
              fallbackSrc={noPostImage}
              alt="Post"
              width={500}
              height={500}
              className="h-auto max-h-[514px] w-full object-cover"
            />
          </div>
        )}
      </div>
      {/* <div className="px-6 py-1 border-b border-black/10">1 like</div> */}
      <div className="mb-4 flex items-center justify-between border-t border-black/10 px-4 py-4 text-[13px] text-gray-500">
        <div className="flex flex-wrap items-center gap-5 select-none">
          {post.isLiked ? (
            <span
              className={`flex items-center gap-1 ${isUnliking ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              onClick={() => handleUnlike(post._id)}
            >
              {isUnliking ? <LoaderIcon /> : <FillLike />} {post.totalLike}
            </span>
          ) : (
            <span
              className={`flex items-center gap-1 ${isLiking ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              onClick={() => !isLiking && handleLike(post._id)}
            >
              {isLiking ? <LoaderIcon /> : <Like />} {post.totalLike}
            </span>
          )}
          <span
            className="flex cursor-pointer items-center gap-1"
            onClick={() => handleShowComments(post._id)}
          >
            <Comment /> {post.totalComment}
          </span>
          <span className="flex items-center gap-1">
            <Share /> {post.totalShare}
          </span>
        </div>
        <span className="text-grayBlueText text-xs font-normal whitespace-nowrap">{postTime}</span>
      </div>

      {/* comment */}
      <AnimatePresence>
        {shoeCommentBoxId == post._id && showComments && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 500, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <FeedComment postId={post._id} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SinglePostFeed;
