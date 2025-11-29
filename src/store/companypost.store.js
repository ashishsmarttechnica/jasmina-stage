// src/store/post.store.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useCompanyPostStore = create(
  devtools(
    (set) => ({
      posts: [],
      selectedPost: null,
      pagination: null,
      hasMore: true,

      setPosts: (posts) => set({ posts }),
      setSelectedPost: (post) => set({ selectedPost: post }),
      setPagination: (pagination) => set({ pagination }),
      setHasMore: (hasMore) => set({ hasMore }),

      // Add a new post to the beginning of the list
      addPost: (newPost) =>
        set((state) => ({
          posts: [newPost, ...state.posts],
        })),

      // Reset store (useful when navigating away or logging out)
      resetPosts: () =>
        set({
          posts: [],
          pagination: null,
          hasMore: true
        }),
    }),
    { name: "PostStore" }
  )
);

export default useCompanyPostStore;