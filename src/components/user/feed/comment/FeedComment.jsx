import CommentSkeleton from "@/common/skeleton/CommentSkeleton";
import { useCommentsByPostId, useCreateComment } from "@/hooks/comment/useComments";
import capitalize from "@/lib/capitalize";
import usePostStore from "@/store/post.store";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

const FeedComment = ({ postId }) => {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({ hasNextPage: false });
  const [newComment, setNewComment] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const { mutate: createComments } = useCreateComment();
  const setAddCommentCount = usePostStore((s) => s.setAddCommentCount);
  const userRole = Cookies.get("userRole");
  const { data, isLoading, isError, error } = useCommentsByPostId(postId, true, page);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    const submittedComment = {
      userId: Cookies.get("userId"),
      postId: postId,
      text: newComment,
      userType: capitalize(userRole),
    };

    createComments(submittedComment, {
      onSuccess: (data) => {
        setNewComment("");
        setComments((prev) => [data.data, ...prev]);
        setAddCommentCount(postId);
      },
    });
  };

  useEffect(() => {
    if (data) {
      const hasNext = data.pagination.page < data.pagination.pages;

      setComments(data.newComments);

      setPagination({ hasNextPage: hasNext });
      setLoadingMore(false);
    }
  }, [data]);

  const loadMoreComments = () => {
    setLoadingMore(true);
    setPage((prev) => prev + 1);
  };

  if (isLoading && page === 1) {
    return <CommentSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="border-t border-black/10">
      <div className="h-full max-h-[400px] overflow-y-auto no-scrollbar pt-2">
        <CommentList comments={comments} />

        {pagination.hasNextPage && (
          <div className="flex p-4">
            <button
              onClick={loadMoreComments}
              disabled={loadingMore}
              className="px-4 py-1 text-sm font-medium text-primary hover:text-white bg-secondary border border-primary rounded hover:bg-primary/80 disabled:text-white disabled:bg-primary/60 transition-all duration-200"
            >
              {loadingMore ? "Loading..." : "Load More Comments"}
            </button>
          </div>
        )}
      </div>

      <CommentInput
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onSubmit={handleCommentSubmit}
      />
    </div>
  );
};

export default React.memo(FeedComment);
