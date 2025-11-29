import { useMutation } from "@tanstack/react-query";
import { signupUser } from "@/api/auth.api";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/navigation";

export default function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data, variables) => {
      if (data?.success === true) {
        toast.success(data.message || "OTP has been sent to your email");

        // Get the email and account type from the form data
        const email = variables.email;
        const role = variables.accountType

        // Navigate to OTP page with email and account type
        router.push(`/verify-otp?email=${email}&role=${role}`);

        // Navigate to OTP verification page with email and account type
      } else {
        toast.error(
          `Signup failed: ${data?.message || "Something went wrong!"}`
        );
      }
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(`An error occurred: ${errorMessage}`);
    },
  });
}
