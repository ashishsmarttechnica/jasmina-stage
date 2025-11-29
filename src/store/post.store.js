// src/store/post.store.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const usePostStore = create(
  devtools(
    (set) => ({
      posts: [],
      singlePost: null,
      selectedPost: null,
      pagination: null,
      hasMore: true,
      

      setPosts: (posts) => set({ posts }),
      setSinglePost: (post) => set({ singlePost: post }),
      setSelectedPost: (post) => set({ selectedPost: post }),
      setPagination: (pagination) => set({ pagination }),
      setHasMore: (hasMore) => set({ hasMore }),

      // Update single post like state
      updateSinglePostLikeState: (userId) =>
        set((state) => ({
          singlePost: state.singlePost
            ? {
                ...state.singlePost,
                isLiked: true,
                totalLike: (state.singlePost.totalLike || 0) + 1,
                likedBy: [...(state.singlePost.likedBy || []), userId],
              }
            : null,
          // Also update in posts array if the post exists there
          posts: state.posts.map((post) =>
            post._id === state.singlePost?._id
              ? {
                  ...post,
                  isLiked: true,
                  totalLike: (post.totalLike || 0) + 1,
                  likedBy: [...(post.likedBy || []), userId],
                }
              : post
          ),
        })),

      // Update single post unlike state
      updateSinglePostUnlikeState: (userId) =>
        set((state) => ({
          singlePost: state.singlePost
            ? {
                ...state.singlePost,
                isLiked: false,
                totalLike: Math.max((state.singlePost.totalLike || 0) - 1, 0),
                likedBy: (state.singlePost.likedBy || []).filter((id) => id !== userId),
              }
            : null,
          // Also update in posts array if the post exists there
          posts: state.posts.map((post) =>
            post._id === state.singlePost?._id
              ? {
                  ...post,
                  isLiked: false,
                  totalLike: Math.max((post.totalLike || 0) - 1, 0),
                  likedBy: (post.likedBy || []).filter((id) => id !== userId),
                }
              : post
          ),
        })),

      setAddCommentCount: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId ? { ...post, totalComment: (post.totalComment || 0) + 1 } : post
          ),
          // Also update single post if it matches
          singlePost:
            state.singlePost?._id === postId
              ? { ...state.singlePost, totalComment: (state.singlePost.totalComment || 0) + 1 }
              : state.singlePost,
        })),

      // Add a new post to the beginning of the list
      addPost: (newPost) =>
        set((state) => ({
          posts: [newPost, ...state.posts],
        })),

      // Reset store (useful when navigating away or logging out)
      resetPosts: () =>
        set({
          posts: [],
          singlePost: null,
          selectedPost: null,
          pagination: null,
          hasMore: true,
        }),
    }),
    { name: "PostStore" }
  )
);

export default usePostStore;
