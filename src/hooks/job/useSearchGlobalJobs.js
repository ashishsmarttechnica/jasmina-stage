import { searchGlobalJobs } from "@/api/job.api";
import useJobStore from "@/store/job.store";
import { useMutation } from "@tanstack/react-query";

export const useSearchGlobalJobs = () => {
  const setJobs = useJobStore((state) => state.setJobs);
  const appendJobs = useJobStore((state) => state.appendJobs);
  const setLoading = useJobStore((state) => state.setLoading);
  const setError = useJobStore((state) => state.setError);
  const setPagination = useJobStore((state) => state.setPagination);

  return useMutation({
    mutationFn: searchGlobalJobs,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data, variables) => {
      try {
        // Handle potential nested data structure (data.data.jobs vs data.jobs)
        const jobs = data?.data?.jobs || data?.jobs || [];
        const total = data?.data?.total || data?.total || 0;
        const totalPages = data?.data?.totalPages || data?.totalPages || 1;

        if (variables.isAppend) {
          appendJobs(jobs);
        } else {
          setJobs(jobs);
        }

        setPagination({ total, totalPages });
        setLoading(false);
      } catch (err) {
        console.error("Error processing search results:", err);
        setError(err);
        setLoading(false);
      }
    },
    onError: (error) => {
      // Prevent unhandled promise rejections
      try {
        console.error("Error searching global jobs:", error);
        setError(error?.response?.data || error?.message || error);
        setLoading(false);
      } catch (err) {
        console.error("Error in error handler:", err);
        setLoading(false);
      }
    },
  });
};
