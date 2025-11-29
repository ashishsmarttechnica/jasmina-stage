import { acceptConnection, rejectConnection } from "@/api/connection.api";
import { getNetworkInvites } from "@/api/networkInvites.api";
import capitalize from "@/lib/capitalize";
import useNetworkInvitesStore from "@/store/networkInvites.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const useNetworkInvites = (page = 1, limit = 100000) => {
  const { data, setData } = useNetworkInvitesStore();

  return useQuery({
    queryKey: ["networkInvites", page, limit],
    queryFn: async () => {
      try {
        const response = await getNetworkInvites({ page, limit });

        if (response?.success) {
          const newData =
            page === 1
              ? response.data
              : {
                  ...response,
                  data: [...(data || []), ...response.data],
                };
          setData(newData);
          return newData;
        }
        throw new Error(response?.message || "failed to fatch");
      } catch (error) {
        console.error("error fetching networkInvites", error);
      }
    },
    enabled: !data.length || page > 1,
    refetchOnWindowFocus: false,
    retry: 1,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 10 * 60 * 1000,
  });
};

export const useAcceptConnection = (options = {}) => {
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const userRole = Cookies.get("userRole");

  return useMutation({
    mutationFn: (data) =>
      acceptConnection({
        senderId: data.id, //sender id
        senderType: capitalize(data.role), //sender role
        reciverId: userId, //login user id
        reciverType: capitalize(userRole), //login user role
      }),
    onSuccess: (data, variables, context) => {
      if (data?.success) {
        toast.success("Connection request accepted successfully!");
        queryClient.invalidateQueries({
          queryKey: ["networkInvites"],
          exact: true,
        });
      } else {
        toast.error(data?.message || "Failed to accept connection request");
      }
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${errorMessage}`);
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

export const useRejectConnection = () => {
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const userRole = Cookies.get("userRole");

  return useMutation({
    mutationFn: (data) =>
      rejectConnection({
        senderId: data.id, //sender id
        senderType: capitalize(data.role), //sender role
        reciverId: userId, //login user id
        reciverType: capitalize(userRole), //login user role
      }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("Connection request rejected successfully!");
        // Only invalidate the networkInvites query with exact match
        queryClient.invalidateQueries({
          queryKey: ["networkInvites"],
          exact: true,
        });
      } else {
        toast.error(data?.message || "Failed to reject connection request");
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${errorMessage}`);
    },
  });
};
