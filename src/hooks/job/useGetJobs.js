import { createJob, getJobs, getRecentJobs, getSingleJob } from "@/api/job.api";
import useJobStore from "@/store/job.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAllJobs = ({ search = "", location = "", lgbtq, page = 1, limit = 100 } = {}) => {
  const setJobs = useJobStore((s) => s.setJobs);
  const jobs = useJobStore((s) => s.jobs);
  const setLoading = useJobStore((s) => s.setLoading);
  const setError = useJobStore((s) => s.setError);
  const setPagination = useJobStore((s) => s.setPagination || function () {});

  return useQuery({
    queryKey: ["jobs", { search, location, lgbtq, page, limit }],
    queryFn: async () => {
      try {
        setLoading(true);
       // console.log("Calling getJobs with params:", { search, location, lgbtq, page, limit });
        const res = await getJobs({ search, location, lgbtq, page, limit });

        // Extract data from response
        const data = res?.data || {};
        const newJobs = data?.jobs || [];

        // Extract pagination info from response
        const pagination = {
          total: data?.total || 0,
          totalPages: data?.totalPages || 1,
          currentPage: data?.currentPage || page,
          pageSize: data?.pageSize || limit,
        };

        // If it's the first page, replace jobs, otherwise append
        const mergedJobs = page === 1 ? newJobs : [...jobs, ...newJobs];

        // Update store
        setJobs(mergedJobs);
        setPagination(pagination);
        setLoading(false);
        setError(null);

        // Calculate if we're on the last page based on pagination info
        const isLastPage = page >= pagination.totalPages;

       // console.log("API Response:", {
        //   jobs: mergedJobs.length,
        //   pagination,
        //   isLastPage,
        // });

        return {
          jobs: mergedJobs,
          pagination,
          isLastPage,
        };
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error);
        setLoading(false);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    keepPreviousData: true, // Keep previous data while fetching new page
  });
};

export const useRecentJobs = () => {
  const setJobs = useJobStore((s) => s.setJobs);
  const setLoading = useJobStore((s) => s.setLoading);
  const setError = useJobStore((s) => s.setError);

  return useQuery({
    queryKey: ["recentJobs"],
    queryFn: async () => {
      try {
        setLoading(true);
        const res = await getRecentJobs();
        const jobs = res?.data?.jobs || [];

        setJobs(jobs);
        setLoading(false);
        setError(null);

        return jobs;
      } catch (error) {
        setError(error);
        setLoading(false);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const addJob = useJobStore((s) => s.addJob); // You might need to add this to your store

  return useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      if (data?.data) {
        // Add the new job to the store if addJob function exists
        if (addJob) {
          addJob(data.data);
        }
      }
      // Invalidate jobs queries to refetch
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      console.error("Job creation failed:", error?.response?.data?.message || error.message);
    },
  });
};

export const useSingleJob = (jobId) => {
  return useQuery({
    queryKey: ["singleJob", jobId],
    queryFn: async () => {
      const res = await getSingleJob(jobId);
      return res;
    },
    enabled: !!jobId,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Legacy hook for backward compatibility
const useGetJobs = ({ search = "", location = "", lgbtq, page = 1, limit = 100 } = {}) => {
  const { data, isLoading, error } = useAllJobs({ search, location, lgbtq, page, limit });
  return { data, isLoading, error };
};

export default useGetJobs;
