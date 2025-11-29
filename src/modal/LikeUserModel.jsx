"use client";

import FillLike from "@/assets/svg/feed/FillLike";
import ImageFallback from "@/common/shared/ImageFallback";
import { useGetLikeUsers } from "@/hooks/post/usePosts";
import getImg from "@/lib/getImg";
import { Modal } from "rsuite";
import likeIcon from "@/assets/like.svg";
import Image from "next/image";
import noImage2 from "@/assets/feed/no-img.png";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

function LikeUserModel({ isOpen, onClose, post }) {
  const t = useTranslations("LikeUserModal");
  const router = useRouter();
  const postId = post?._id;
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLikeUsers(postId, {
    enabled: isOpen && Boolean(postId),
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: "always",
    limit: 10000000000,
  });

  const likeUsers = useMemo(
    () => data?.pages?.flatMap((page) => page.likes || []) || [],
    [data]
  );

  const totalLikedPeople =
    data?.pages?.[0]?.total ??
    data?.pages?.[0]?.pagination?.total ??
    post?.totalLike ??
    likeUsers.length ??
    0;

  const remainingCount = Math.max((totalLikedPeople || 0) - likeUsers.length, 0);
  const skeletonCount = Math.min(5, remainingCount);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-6 text-sm text-gray-500">
          {t("loading")}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-sm text-red-500">
          {error?.response?.data?.message || t("error")}
        </div>
      );
    }

    if (!likeUsers.length) {
      return (
        <div className="flex items-center justify-center py-6 text-sm text-gray-500">
          {t("empty")}
        </div>
      );
    }

    return (
      <>
        {likeUsers.map((like) => {
      const user = like?.user || {};
      const profile = user?.profile || {};
      const preferences = user?.preferences || {};
      const userId =
        user?._id ||
        like?.userId ||
        like?.user?._id ||
        like?.likedBy ||
        like?.userDetails?._id;
      const userRole =
        (user?.role ||
          like?.userType ||
          like?.user?.role ||
          like?.role ||
          "").toString().toLowerCase();

      const handleNavigateToProfile = () => {
        if (!userId) return;
        const path =
          userRole === "company"
            ? `/company/single-company/${userId}?fromConnections=true`
            : `/single-user/${userId}`;

        router.push(path);
      };
      const name =
        profile.fullName ||
        user.companyName ||
        like?.userName ||
        `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
        t("unknownUser");

      const secondaryText =
        preferences?.jobRole ||
        profile.designation ||
        profile.headline ||
        profile.location ||
        user.companyTagline ||
        like?.designation ||
        like?.headline ||
        like?.location ||
        "";

      const tertiaryText =
        profile.company ||
        user.companyName ||
        preferences?.industry ||
        like?.companyName ||
        "";

      const profileImg = getImg(
        profile.photo ||
          user.logoUrl ||
          like?.profileImage ||
          like?.userImage
      );

      return (
        <div
          key={like?._id || `${postId}-${user?._id || name}`}
          className="group relative flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white/80 p-3  transition-all hover:border-rose-200 hover:bg-white "
        >
          <button
            type="button"
            onClick={handleNavigateToProfile}
            className="relative flex items-center gap-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-rose-200"
          >
            <div className="relative h-12 w-12 shrink-0">
              <ImageFallback
                src={profileImg}
                alt={name}
                fallbackSrc={noImage2}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-gray-100 object-cover transition-transform group-hover:scale-[1.03]"
              />
              <Image
                src={likeIcon}
                alt="like-icon"
                className="absolute -bottom-1 -right-1 h-4 w-4 drop-shadow-sm transition-transform group-hover:scale-110"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-900 ">
                {name}
              </p>
              {secondaryText && (
                <p className="text-xs text-gray-500">{secondaryText}</p>
              )}
              {tertiaryText && (
                <p className="text-[11px] font-medium text-gray-400">
                  {tertiaryText}
                </p>
              )}
            </div>
          </button>

          <div className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-rose-500">
            <FillLike className="h-3.5 w-3.5 text-rose-500" />
            <span className="text-xs font-semibold">{t("badge")}</span>
          </div>
        </div>
      );
    })}

        {isFetchingNextPage &&
          Array.from({ length: skeletonCount }, (_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3 shadow-inner"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-rose-100" />
            </div>
          ))}

        {hasNextPage && (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            className="mx-auto flex items-center justify-center rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-semibold text-rose-500 transition-colors hover:border-rose-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage
              ? t("loadingMore")
              : t("showMore", { count: Math.min(20, remainingCount) })}
          </button>
        )}
      </>
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      backdrop={true}
      keyboard
      size="sm"
      className="like-user-modal [&_.rs-modal-dialog]:!max-w-xl"
    >
      <Modal.Header className="header-model rs-modal-header rs-right-model border-none pb-0" >
        <Modal.Title className="flex items-center justify-between gap-3 text-lg font-semibold text-gray-900" closeButton>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-500 shadow-inner">
              <FillLike className="h-4 w-4" />
            </span>
            {t("title")}
          </div>
        </Modal.Title>
        <p className="my-4 text-sm text-gray-500">
          {t("showingCount", {
            current: likeUsers.length,
            total: totalLikedPeople,
          })}
        </p>
      </Modal.Header>
      <Modal.Body className="">
        <div className="hide-scrollbar max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {renderContent()}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default LikeUserModel;