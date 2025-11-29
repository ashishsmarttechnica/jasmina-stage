// hooks/useResendOtp.js

import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "@/api/auth.api";
import { toast } from "react-toastify";

export default function useResendOtp() {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      if (data?.success === true) {
        toast.success(data.message || "OTP resent successfully!");
      } else {
        toast.error(data?.message || "Failed to resend OTP!");
      }
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${errorMessage}`);
    },
  });
}
