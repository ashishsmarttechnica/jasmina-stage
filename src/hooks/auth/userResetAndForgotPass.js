import { forgotPassword, resetPassword } from "@/api/auth.api";
import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
export default function useUserResetAndForgotPass() {
  const router = useRouter();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      if (data?.success === true) {
        toast.success(data.message || "Password reset successfully!");
        router.push("/login");
      } else {
        toast.error(data?.message || "OTP verification failed!");
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${errorMessage}`);
    },
  });
}

export function useUserResetPass() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data?.success === true) {
        toast.success(data.message || "Password reset successfully!");
      } else {
        toast.error(data?.message || "OTP verification failed!");
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${errorMessage}`);
    },
  });
}
