import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import useCompanyVerificationStore from "../../store/companyVerification.store";
import useNewJobPostStore from "../../store/newjobpost.store";

export const useCompanyVerification = () => {
  const companyId = Cookies.get("userId");
  const setMessage = useNewJobPostStore((s) => s.setMessage);
  const setIsverified = useNewJobPostStore((s) => s.setIsverified);

  // Get store state and actions
  const {
    isVerified,
    isLoading,
    error,
    message: storeMessage,
    checkVerification
  } = useCompanyVerificationStore();

  return useQuery({
    queryKey: ["companyVerification", companyId],
    queryFn: async () => {
      const result = await checkVerification(companyId);

      // Update the old store for backward compatibility
      if (result.success) {
        setIsverified(true);
        setMessage(""); // Clear any previous error messages
      } else {
        setIsverified(false);
        setMessage(result.message || "Verification failed");
      }

      return result;
    },
    enabled: !!companyId,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useCompanyVerification;
