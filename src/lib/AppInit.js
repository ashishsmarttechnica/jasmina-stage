"use client";
import useDndSocket from "@/hooks/chat/useDndSocket";
import { useRouter } from "@/i18n/navigation";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/store/auth.store";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { getnotificationSocket } from "../utils/socket";

const AppInit = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const router = useRouter();

  // Initialize global DND socket listener
  useDndSocket();

  useEffect(() => {
    const initApp = async () => {
      const token = Cookies.get("token");
      setAuthLoading(true);

      if (token) {
        try {
          // Call refresh token API
          const response = await axiosInstance.post("/refresh/token", { token });

          if (response.data.success) {
            const newToken = response.data.data.token;
            const user = response.data.data;

            // Save new token & user
            Cookies.set("token", newToken);
            setToken(newToken);
            setUser(user);

            // 🚀 Setup Notification Socket
          
          } else {
            logout();
            router.push("/login");
          }
        } catch (error) {
          console.error("Failed to refresh token", error);
          logout();
          router.push("/login");
        }
      }

      setAuthLoading(false);
    };

    initApp();
  }, [setToken, setUser, router, logout, setAuthLoading]);

  return null; // no UI rendered
};

export default AppInit;
