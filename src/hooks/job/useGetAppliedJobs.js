import useAppliedJobStore from "@/store/appliedJob.store";
import Cookies from "js-cookie";
import { useEffect } from "react";

const useGetAppliedJobs = (page = 1, limit = 10) => {
  const { getAppliedJobs, appliedJobs, isLoading, error, pagination } = useAppliedJobStore();

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      getAppliedJobs({
        userId,
        page,
        limit,
        onSuccess: () => {
         // console.log("Applied jobs fetched successfully");
        },
        onError: (error) => {
          console.error("Error fetching applied jobs:", error);
        },
      });
    }
  }, [getAppliedJobs, page, limit]);

  return { appliedJobs, isLoading, error, pagination };
};

export default useGetAppliedJobs;
