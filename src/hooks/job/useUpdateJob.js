import { updateJob } from "@/api/job.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ jobId, data }) => {
            return updateJob({ jobId, data });
        },
        onSuccess: (data) => {
            if (data?.success) {
                toast.success("Job updated successfully");
                // Invalidate and refetch all relevant queries
                queryClient.invalidateQueries(["singleJob"]);
                queryClient.invalidateQueries(["singleCompanyAppliedJob"]);
                queryClient.invalidateQueries(["jobs"]);
                queryClient.invalidateQueries(["recentJobs"]);
            } else {
                toast.error(data?.message || "Failed to update job");
            }
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Error updating job");
        },
    });
};

export default useUpdateJob;

