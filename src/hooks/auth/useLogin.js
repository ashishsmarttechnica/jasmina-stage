import { loginUser } from "@/api/auth.api";
import { useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import useAuthStore from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import useModalStore from "../../store/modal.store";

const isValidRedirectPath = (path) => {
  if (!path || typeof path !== "string") return null;

  // Decode URL-encoded path
  try {
    path = decodeURIComponent(path);
  } catch {
    // If decoding fails, use original path
  }

  // Allow any path that starts with / (including locale paths like /en/jobs/...)
  if (!path.startsWith("/")) return null;

  // Clean up the path - remove any undefined strings
  let cleanPath = path.replace(/undefined/g, "");

  // Strip locale prefix if present (e.g., /en/jobs/... -> /jobs/...)
  // The router from @/i18n/navigation will automatically add the locale
  const pathSegments = cleanPath.split("/").filter(Boolean);
  if (pathSegments.length > 0 && routing.locales.includes(pathSegments[0])) {
    // Remove the locale segment
    pathSegments.shift();
    cleanPath = "/" + pathSegments.join("/");
  }

  // Ensure path starts with /
  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }

  // If path is /jobs/apply-now/..., redirect to /jobs with jobId as query param
  if (cleanPath.startsWith("/jobs/apply-now/")) {
    const pathParts = cleanPath.split("/").filter(Boolean);
    // Extract jobId from path like /jobs/apply-now/{jobId}/...
    if (pathParts.length >= 3 && pathParts[0] === "jobs" && pathParts[1] === "apply-now") {
      const jobId = pathParts[2];
      return `/jobs?selectedJobId=${jobId}`;
    }
  }

  // Basic validation: ensure it's a valid path format
  // Allow paths like /jobs, /feed, /company/..., etc.
  if (
    cleanPath.startsWith("/jobs") ||
    cleanPath.startsWith("/company/") ||
    cleanPath.startsWith("/feed") ||
    cleanPath.startsWith("/user/") ||
    cleanPath.startsWith("/post/") ||
    cleanPath.startsWith("/pagedetail/") ||
    cleanPath === "/"
  ) {
    return cleanPath;
  }

  // For other paths, return null to be safe
  return null;
};

export default function useLogin({ redirectPath } = {}) {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const normalizedRedirect = isValidRedirectPath(redirectPath);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data?.success === true) {
        // console.log(data, "data++++++++++++++");
        const token = data.data.token;
        const role = data.data.role;
        const profileComplete = data.data.profileComplete;
        const BlockModel = data?.data?.status;
        // console.log(BlockModel, "BlockModel++++++++++++++");
        // Set cookies for middleware
        Cookies.set("token", token);
        Cookies.set("userRole", role);
        Cookies.set("isAuthenticated", "true");
        Cookies.set("profileCreated", profileComplete);
        Cookies.set("userId", data.data._id);
        Cookies.set("stripeCustomerId", data.data.stripeCustomerId);
        localStorage.setItem("stripeCustomerId", data.data.stripeCustomerId);
        // 
        // Zustand update
        setToken(token);
        setUser(data.data);

        toast.success("Login successful!");

        // Check if redirect was already used (stored in sessionStorage)
        // Only use redirect if it's a job apply-now path and hasn't been used yet
        const redirectUsed = typeof window !== "undefined" ? sessionStorage.getItem("redirectUsed") : null;
        const isJobApplyRedirect = normalizedRedirect && normalizedRedirect.includes("selectedJobId");

        if (isJobApplyRedirect && !redirectUsed) {
          // Mark redirect as used so it won't work again after logout/login
          if (typeof window !== "undefined") {
            sessionStorage.setItem("redirectUsed", "true");
          }
          router.push(normalizedRedirect);
        } else {
          // Clear redirect flag if it exists (for normal logins or if redirect was already used)
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("redirectUsed");
          }

          if (role === "user") {
            router.push("/feed");
            if (BlockModel === 2) {
              setTimeout(() => {
                const { openBlockedModal } = useModalStore.getState();
                openBlockedModal();
              }, 1300);
            }
          } else if (role === "company") {
            router.push("/company/feed");
          } else {
            router.push("/");
          }
        }
      } else {
        toast.error(`Login failed: ${data?.message || "Something went wrong!"}`);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error(
        `An error occurred: ${error?.response?.data?.message || "Something went wrong!"}`
      );
    },
  });
}
