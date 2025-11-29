import { loginUser } from "@/api/auth.api";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import useModalStore from "../../store/modal.store";

const isValidRedirectPath = (path) => {
  if (!path || typeof path !== "string") return null;
  if (!path.startsWith("/")) return null;
  try {
    const url = new URL(path, "http://example.com");
    return url.pathname.startsWith("/") ? `${url.pathname}${url.search}${url.hash}`.replace(/undefined/g, "") : null;
  } catch {
    return null;
  }
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


        if (normalizedRedirect) {
          router.push(normalizedRedirect);
        } else if (role === "user") {
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
