import { updateInterview } from "@/api/interview.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateInterview = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInterview,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message || "Interview re-scheduled successfully");
        // Invalidate interviews query to refresh the list
        queryClient.invalidateQueries({ queryKey: ["interviews"] });
        if (onSuccess) onSuccess();
      } else {
        toast.error(data?.message || "Failed to re-schedule interview");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};
