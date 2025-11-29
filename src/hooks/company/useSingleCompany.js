"use client";

import { getCompany } from "@/api/company.api";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const useSingleCompany = (userId) => {
  const viewUserId = Cookies.get("userId");
  return useQuery({
    queryKey: ["singleCompany", userId],
    queryFn: () => getCompany(userId, viewUserId),
    select: (res) => res.data,
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
