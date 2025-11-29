"use client";

import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Profile from "../common/Profile";
import PostSkeleton from "../common/skeleton/PostSkeleton";
import UserMightKnow from "../common/UserMightKnow";
import DynamicPost from "../components/user/feed/DynamicPost";
import { useLikePost, useSinglePost, useUnlikePost } from "../hooks/post/usePosts";
import usePostStore from "../store/post.store";
import MainLayout from "./MainLayout";



const SinglePostLayout = () => {
  const params = useParams();
  const id = params?.id;
  const t = useTranslations("UserMainFeed");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = Cookies.get("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  // Get store functions and state
  const singlePost = usePostStore((s) => s.singlePost);
  const setSinglePost = usePostStore((s) => s.setSinglePost);
  const updateSinglePostLikeState = usePostStore((s) => s.updateSinglePostLikeState);
  const updateSinglePostUnlikeState = usePostStore((s) => s.updateSinglePostUnlikeState);

  // Get mutations
  const { mutate: likePost, isLoading: isLiking } = useLikePost();
  const { mutate: unlikePost, isLoading: isUnliking } = useUnlikePost();

  // Fetch single post data
  const { data: postData, isLoading, isError } = useSinglePost(id);

  const handleLike = (postId) => {
    likePost(postId, {
      onSuccess: (response) => {
        if (response?.success) {
          updateSinglePostLikeState(response.data.userId);
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

  const handleUnlike = (postId) => {
    unlikePost(postId, {
      onSuccess: (response) => {
        if (response?.success) {
          updateSinglePostUnlikeState(response.data.userId);
          // toast.success(response.message || "Post unliked successfully!");
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

  // Function to render skeleton loaders
  const renderSkeletons = (count = 1) => {
    return (
      <div className="w-full space-y-6 xl:max-w-[547px]">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <PostSkeleton key={`skeleton-${index}`} />
          ))}
      </div>
    );
  };

  // Function to render the post content
  const renderPostContent = () => {
    if (isLoading) {
      return <div className="mx-auto w-full max-w-[547px]">{renderSkeletons()}</div>;
    }

    if (isError || !singlePost) {
      return (
        <div className="mx-auto w-full max-w-[547px]">
          <div className="rounded-lg bg-white p-4 shadow-sm">Post not found.</div>
        </div>
      );
    }

    return (
      <div className="mx-auto w-full max-w-[547px]">
        <DynamicPost
          post={singlePost}
          onLike={handleLike}
          onUnlike={handleUnlike}
          isLiking={isLiking}
          isUnliking={isUnliking}
          isSinglePost={true}
        />
      </div>
    );
  };

  // If user is not authenticated, show only the post
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full px-4">{renderPostContent()}</div>
      </div>
    );
  }

  // If user is authenticated, show full layout
  return (
    <MainLayout
      leftComponents={[<Profile key="left1" />]}
      rightComponents={[<UserMightKnow key="right1" />]}
    >
      {renderPostContent()}
    </MainLayout>
  );
};

export default SinglePostLayout;
