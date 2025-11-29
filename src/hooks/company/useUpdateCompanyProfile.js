import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/navigation";
import Cookies from "js-cookie";
import useCompanyStore from "@/store/company.store";
import { updateCompanyProfile } from "@/api/company.api";

export default function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();
  const { setCompany } = useCompanyStore();
  const router = useRouter();
  const userId = Cookies.get("userId");

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData) => updateCompanyProfile({ data: formData, userId }),
    onSuccess: (data) => {
      if (data?.success === true) {
        // Update the user data in Zustand store
        setCompany(data.data);

        // Invalidate and refetch user data
        queryClient.invalidateQueries(["company"]);

        toast.success(data.message || "Profile updated successfully!");

        // // Navigate to the next step or dashboard
        // router.push("/user/preferences");
      } else {
        toast.error(data?.message || "Failed to update profile!");
      }
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${errorMessage}`);
    },
  });

  return { mutate, isPending, error };
}
