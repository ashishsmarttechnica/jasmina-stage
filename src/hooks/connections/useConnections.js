import {
  createConnection,
  getCompanyConnections,
  getConnections,
  getOthersCompanyConnections,
  getOthersUserConnections,
  removeConnection,
} from "@/api/connection.api";
import capitalize from "@/lib/capitalize";
import useConnectionsStore, { useCompanyConnectionsStore } from "@/store/connections.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const useConnections = (connectionType, page, limit, options = {}) => {
  const userId = options.userId || Cookies.get("userId");
  const userType = options.userType || capitalize(Cookies.get("userRole"));
  const { connections, setConnections, setPagination, setHasMore } = useConnectionsStore();

  return useQuery({
    queryKey: ["connections", userId, userType, page],
    queryFn: async () => {
      const res = await getConnections({ userId, userType, page, limit, connectionType });

      if (res?.success) {
        const newData = res.data.results || [];
        const pagination = res.data.pagination;

        // Append or replace based on page
        const mergedConnections = page === 1 ? newData : [...connections, ...newData];

        setConnections(mergedConnections);
        setPagination(pagination);
        setHasMore(pagination.currentPage < pagination.totalPages);

        return {
          connections: mergedConnections,
          isLastPage: pagination.currentPage >= pagination.totalPages,
        };
      }

      throw new Error(res?.message || "Failed to fetch connections");
    },
    enabled: !!userId && !!userType && !!page,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...options,
  });
};
export const useCompanyConnections = (connectionType, page, limit, options = {}) => {
  const userId = options.userId || Cookies.get("userId");
  const userType = options.userType || capitalize(Cookies.get("userRole"));
  const { connections, setConnections, setPagination, setHasMore } = useCompanyConnectionsStore();

  return useQuery({
    queryKey: ["companyConnections", userId, userType, page],
    queryFn: async () => {
      const res = await getCompanyConnections({ userId, userType, page, limit, connectionType });

      if (res?.success) {
        const newData = res.data.results || [];
        const pagination = res.data.pagination;

        // Append or replace based on page
        const mergedConnections = page === 1 ? newData : [...connections, ...newData];

        setConnections(mergedConnections);
        setPagination(pagination);
        setHasMore(pagination.currentPage < pagination.totalPages);

        return {
          connections: mergedConnections,
          isLastPage: pagination.currentPage >= pagination.totalPages,
        };
      }

      throw new Error(res?.message || "Failed to fetch connections");
    },
    enabled: !!userId && !!userType && !!page,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCreateConnection = () => {
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const userRole = Cookies.get("userRole");

  return useMutation({
    mutationFn: (data) =>
      {
      console.log(data, "data123456789123456789");
      return createConnection({
        senderId: userId, //login user id
        senderType: capitalize(userRole), //login user role
        reciverId: data.id, //sender id
        reciverType: capitalize(data.role), //sender role
      });
      },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("Connection request sent successfully!");
        // Only invalidate the userSuggestions query with exact match
        queryClient.invalidateQueries({
          queryKey: ["userSuggestions"],
          exact: true,
        });
      } else {
        toast.error(data?.message || "Failed to send connection request");
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${errorMessage}`);
    },
  });
};

export const useRemoveConnection = () => {
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const userRole = Cookies.get("userRole");
  const { connections, setConnections } = useConnectionsStore();

  return useMutation({
    mutationFn: (data) =>
      removeConnection({
        userId: userId,
        userType: capitalize(userRole),
        connectionId: data.id,
        connectionType: capitalize(data.role),
      }),
    onSuccess: (data, variables) => {
      if (data?.success) {
        toast.success("Connection removed successfully!");
        const updatedConnections = connections.filter((conn) => conn._id !== variables.id);
        setConnections(updatedConnections);
      } else {
        toast.error(data?.message || "Failed to remove connection");
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${errorMessage}`);
    },
  });
};

// New: useOthersUserConnections
export const useOthersUserConnections = (page, limit, options = {}) => {
  const userId = options.userId || Cookies.get("userId"); // viewer
  const profileId = options.profileId;
  const userType = options.userType || capitalize(Cookies.get("userRole"));
  const { connections, setConnections, setPagination, setHasMore } = useConnectionsStore();

  return useQuery({
    queryKey: ["othersUserConnections", userId, profileId, userType, page],
    queryFn: async () => {
      const res = await getOthersUserConnections({ userId, profileId, userType, page, limit });
      if (res?.success) {
        const newData = res.data.results || [];
        const pagination = res.data.pagination;
        const mergedConnections = page === 1 ? newData : [...connections, ...newData];
        setConnections(mergedConnections);
        setPagination(pagination);
        setHasMore(pagination.currentPage < pagination.totalPages);
        return {
          connections: mergedConnections,
          isLastPage: pagination.currentPage >= pagination.totalPages,
        };
      }
      throw new Error(res?.message || "Failed to fetch connections");
    },
    enabled: !!userId && !!profileId && !!userType && !!page,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// New: useOthersCompanyConnections
export const useOthersCompanyConnections = (page, limit, options = {}) => {
  const userId = options.userId || Cookies.get("userId"); // viewer
  const profileId = options.profileId;
  const userType = options.userType || capitalize(Cookies.get("userRole"));
  const { connections, setConnections, setPagination, setHasMore } = useConnectionsStore();

  return useQuery({
    queryKey: ["othersCompanyConnections", userId, profileId, userType, page],
    queryFn: async () => {
      const res = await getOthersCompanyConnections({ userId, profileId, userType, page, limit });
      if (res?.success) {
        const newData = res.data.results || [];
        const pagination = res.data.pagination;
        const mergedConnections = page === 1 ? newData : [...connections, ...newData];
        setConnections(mergedConnections);
        setPagination(pagination);
        setHasMore(pagination.currentPage < pagination.totalPages);
        return {
          connections: mergedConnections,
          isLastPage: pagination.currentPage >= pagination.totalPages,
        };
      }
      throw new Error(res?.message || "Failed to fetch connections");
    },
    enabled: !!userId && !!profileId && !!userType && !!page,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...options,
  });
};
