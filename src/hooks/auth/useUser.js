// src/hooks/useUser.js
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/auth.api";
import Cookies from "js-cookie";
import useAuthStore from "@/store/auth.store";

export default function useUser() {
  const userId = Cookies.get("userId");
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      getUser(userId).then((res) => {
        setUser(res.data);
        return res.data;
      }),
    select: (res) => res.data,
    onError: (error) => {
      console.error(
        "❌ Failed to fetch user:",
        error?.response?.data || error.message
      );
    },

    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
