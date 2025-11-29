"use client";
import CreatePost from "@/common/CreatePost";
import PostSkeleton from "@/common/skeleton/PostSkeleton";
import { useAllPosts } from "@/hooks/post/usePosts";
import usePostStore from "@/store/post.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../store/auth.store";
import DynamicPost from "./DynamicPost";
import RecentJobs from "./RecentJobs";

const FeedPost = ({ isUser = false }) => {
  const t = useTranslations("FeedComment");
  const [page, setPage] = useState(1);
  const posts = usePostStore((s) => s.posts);
  const pagination = usePostStore((s) => s.pagination);
  const resetPosts = usePostStore((s) => s.resetPosts);
  const loaderRef = useRef(null);
  const userType = Cookies.get("userRole");
  const { user } = useAuthStore();
  console.log(user,"user_________________");
   
  const { isLoading, isError, isFetching } = useAllPosts(page);

  // Reset store when component mounts
  useEffect(() => {
    resetPosts();
  }, [resetPosts]);

  // Infinite scroll logic
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetching &&
          page < pagination?.totalPages
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [isFetching, pagination, page]);

  // Function to render skeleton loaders
  const renderSkeletons = (count = 3) =>
    Array(count)
      .fill(0)
      .map((_, index) => <PostSkeleton key={`skeleton-${index}`} />);

  // Initial loading (first page only)
  if (isLoading && page === 1) {
    return (
      <div className="w-full space-y-6 xl:max-w-[547px]">
        {(isUser || user?.companyType === "ngo") && <CreatePost />}
        {renderSkeletons()}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full xl:max-w-[547px]">
        {(isUser || user?.companyType === "ngo") && <CreatePost />}
        <div className="rounded-lg bg-white p-4 py-10 text-center text-red-500 shadow">
          {t("errorposts")}
        </div>
      </div>
    );
  }

  // No posts
  if (!posts?.length) {
    return (
      <div className="w-full xl:max-w-[547px]">
        {(isUser || user?.companyType === "ngo") && <CreatePost />}
        <div className="rounded-lg bg-white p-4 py-10 text-center shadow">
          {t("nofound")}
        </div>
      </div>
    );
  }

  return (
    <>
{(isUser || user?.companyType === "ngo") && <CreatePost />}


      <div className="w-full space-y-6 xl:max-w-[547px]">
        {posts.map((post, index) => (
          <React.Fragment key={post._id + index}>
            {index === 1 && userType === "user" && <RecentJobs post={post} />}
            <DynamicPost post={post} />
          </React.Fragment>
        ))}

        {/* Append skeletons at bottom while fetching */}
        {isFetching && page > 1 && renderSkeletons(2)}

        {/* Infinite scroll trigger */}
        <div ref={loaderRef} className="h-1" />
      </div>
    </>
  );
};

export default FeedPost;
