import { getRecentJobs } from "@/api/job.api";
import useResentJobStore from "@/store/resentjob.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const useGetResentJob = (userId) => {
  const { setResentJobs, setLoading, setError } = useResentJobStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recentJobs", userId],
    queryFn: () => getRecentJobs(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes - cache data for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
  });

  useEffect(() => {
    if (data) {
      setResentJobs(data.data);
    }
    setLoading(isLoading);
    if (error) {
      setError(error);
    }
  }, [data, isLoading, error, setResentJobs, setLoading, setError]);

  return { data, isLoading, error };
};

export default useGetResentJob;
