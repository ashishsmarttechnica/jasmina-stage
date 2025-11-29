import { updateJobStatus } from "@/api/job.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, status }) => {
     // console.log("useUpdateJobStatus mutationFn called with:", { jobId, status }); // Debug log
      return updateJobStatus({ jobId, status });
    },
    onSuccess: (data) => {
     // console.log("useUpdateJobStatus onSuccess:", data); // Debug log
      if (data?.success) {
        toast.success("Status updated successfully");
        // Invalidate and refetch all relevant queries
        queryClient.invalidateQueries(["singleCompanyAppliedJob"]);
        queryClient.invalidateQueries(["jobs"]);
        queryClient.invalidateQueries(["recentJobs"]);
        queryClient.invalidateQueries(["applicants"]);
      } else {
        toast.error(data?.message || "Failed to update status");
      }
    },
    onError: (error) => {
     // console.log("useUpdateJobStatus onError:", error); // Debug log
      toast.error(error?.response?.data?.message || "Error updating status");
    },
  });
};

export default useUpdateJobStatus;
