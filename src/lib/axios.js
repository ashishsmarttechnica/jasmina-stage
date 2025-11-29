import useAuthStore from "@/store/auth.store";
import useModalStore from "@/store/modal.store";
import axios from "axios";
import useReviewStore from "../store/verify.store";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 1000000, // 10 seconds timeout // for local data
  headers: {
    // "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to attach auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Prefer in-memory token; fall back to cookie to avoid early-mount race conditions
    const storeToken = useAuthStore.getState().token;
    const cookieToken = Cookies.get("token");
    const token = storeToken || cookieToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    // console.log(status, "statusstatusstatus");


    if (status === 505) {
      const { openBlockedModal } = useModalStore.getState();
      openBlockedModal();
    }
    if (status === 506) {
      const { openReviewModal } = useReviewStore.getState();
      openReviewModal()
    }
    if (status === 507) {
      const { openUserBlockedModal } = useModalStore.getState();
      openUserBlockedModal()
    }

    console.error(
      "API Error:",
      status,
      error?.response?.data || error?.message
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
