import useJobStore from "@/store/job.store";
import Cookies from "js-cookie";
import { useEffect } from "react";

const useGetSavedJobs = () => {
  const { getSavedJobs, isLoading, error, jobs } = useJobStore();

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      getSavedJobs({
        userId,
        onSuccess: (res) => {
         // console.log("Saved jobs fetched successfully");
        },
        onError: (error) => {
          console.error("Error fetching saved jobs:", error);
        },
      });
    }
  }, [getSavedJobs]);

  return { jobs, isLoading, error };
};

export default useGetSavedJobs;
