import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCompanyPost, getAllCompanyPosts, getPostCompanyById } from "@/api/company.api";
import useCompanyPostStore from "@/store/companypost.store";

export const useCompanyAllPosts = (page = 1) => {
  const setPosts = useCompanyPostStore((s) => s.setPosts);
  const posts = useCompanyPostStore((s) => s.posts);
  const setPagination = useCompanyPostStore((s) => s.setPagination);

  return useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const res = await getAllCompanyPosts(page);

      // Your API directly returns the structure we need
      const data = res?.data || {};
      const newPosts = data?.posts || [];
      const pagination = data?.pagination || {};

      // If it's the first page, replace posts, otherwise append
      const mergedPosts = page === 1 ? newPosts : [...posts, ...newPosts];

      setPagination(pagination);
      setPosts(mergedPosts);

      // Calculate if we're on the last page based on pagination info
      const isLastPage = page >= pagination.totalPages;

      return {
        newPosts: mergedPosts,
        pagination,
        isLastPage,
      };
    },
    retry: 1,
    refetchOnWindowFocus: false,
    keepPreviousData: true, // Keep previous data while fetching new page
  });
};

export const useCompanyPostById = (id) => {
  const setSelectedPost = useCompanyPostStore((s) => s.setSelectedPost);

  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostCompanyById(id),
    enabled: !!id,
    select: (res) => res.data,
    onSuccess: (data) => {
      setSelectedPost(data); // ✅ Save to Zustand
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCompanyCreatePost = () => {
  const queryClient = useQueryClient();
  const addPost = useCompanyPostStore((s) => s.addPost); // optional if you want to add to local state

  return useMutation({
    mutationFn: createCompanyPost,

    onSuccess: (data) => {
      if (data?.data) {
        addPost(data.data);
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: (error) => {
      console.error(
        "Post creation failed:",
        error?.response?.data?.message || error.message
      );
    },
  });
};
