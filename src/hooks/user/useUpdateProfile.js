import { updateUserProfile } from "@/api/auth.api";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const router = useRouter();
  const userId = Cookies.get("userId");

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData) => updateUserProfile({ data: formData, userId }),
    onSuccess: (data) => {
      if (data?.success === true) {
        // Update the user data in Zustand store
        setUser(data.data);

        // Invalidate and refetch user data
        queryClient.invalidateQueries(["user"]);

        toast.success(data.message || "Profile updated successfully!");

        // // Navigate to the next step or dashboard
        // router.push("/user/preferences");
      } else {
        toast.error(data?.message || "Failed to update profile!");
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${errorMessage}`);
    },
  });

  return { mutate, isPending, error };
}
