import { createJob, saveJob } from "@/api/job.api";
import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";

export const useCreateJob = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data) => createJob(data),
    onSuccess: (response) => {
      if (response.success) {
        router.push("/jobs");
      } else {
        toast.error(response.message || "Failed to create job");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

export const useSaveJob = () => {
  return useMutation({
    mutationFn: saveJob,
  });
};
