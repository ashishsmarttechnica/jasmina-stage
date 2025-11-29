import {create} from "zustand";
import {devtools} from "zustand/middleware";

const useCommentStore = create(
  devtools(
    (set) => ({
      comments: [],
      selectedComment: null,
      pagination: null,

      setComments: (comments) => set({comments}),
      setSelectedComment: (comment) => set({selectedComment: comment}),
      setPagination: (pagination) => set({pagination}),

      // Add a new comment to the beginning of the list
      addComment: (newComment) =>
        set((state) => ({
          comments: [newComment, ...state.comments],
        })),

      // Reset store (useful when navigating away or logging out)
      resetComments: () =>
        set({
          comments: [],
          pagination: null,
          hasMore: true
        }),
    }),
    {name: "CommentStore"}
  )
);
export default useCommentStore;
