import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useSingleUserStore = create(
  devtools(
    (set) => ({
      // Single user data
      userData: null,
      userPosts: [],
      isLoading: true,
      error: null,
      pagination: null,
      hasMorePosts: true,

      // Actions
      setUserData: (data) => set({ userData: data }),
      setUserPosts: (posts) => set({ userPosts: posts }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setPagination: (pagination) => set({ pagination }),
      setHasMorePosts: (hasMore) => set({ hasMorePosts: hasMore }),

      // Update post like state
      updatePostLikeState: (postId, userId) =>
        set((state) => ({
          userPosts: state.userPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLiked: true,
                  totalLike: (post.totalLike || 0) + 1,
                  likedBy: [...(post.likedBy || []), userId],
                }
              : post
          ),
        })),

      // Update post unlike state
      updatePostUnlikeState: (postId, userId) =>
        set((state) => ({
          userPosts: state.userPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLiked: false,
                  totalLike: Math.max((post.totalLike || 0) - 1, 0),
                  likedBy: (post.likedBy || []).filter((id) => id !== userId),
                }
              : post
          ),
        })),

      // Add a new post
      addPost: (newPost) =>
        set((state) => ({
          userPosts: [newPost, ...state.userPosts],
        })),

      // Update post comment count
      updatePostCommentCount: (postId) =>
        set((state) => ({
          userPosts: state.userPosts.map((post) =>
            post._id === postId ? { ...post, totalComment: (post.totalComment || 0) + 1 } : post
          ),
        })),

      // Reset store
      resetStore: () =>
        set({
          userData: null,
          userPosts: [],
          isLoading: true,
          error: null,
          pagination: null,
          hasMorePosts: true,
        }),
    }),
    { name: "SingleUserStore" }
  )
);

export default useSingleUserStore;
