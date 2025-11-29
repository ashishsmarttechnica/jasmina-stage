import { scheduleInterview } from "@/api/interview.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useScheduleInterview = (onSuccess) => {
  return useMutation({
    mutationFn: scheduleInterview,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message || "Interview scheduled successfully");
        if (onSuccess) onSuccess();
      } else {
        toast.error(data?.message || "Failed to schedule interview");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};
