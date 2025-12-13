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
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export const useConnections = (connectionType, page, limit, options = {}) => {
  const userId = options.userId || Cookies.get("userId");
  const userType = options.userType || capitalize(Cookies.get("userRole"));
  const { connections, setConnections, setPagination, setHasMore } = useConnectionsStore();
  const t = useTranslations("Connections");

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

      throw new Error(res?.message || t("fetchFailed"));
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
  const t = useTranslations("Connections");

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

      throw new Error(res?.message || t("fetchFailed"));
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
  const t = useTranslations("Connections");

  return useMutation({
    mutationFn: (data) => {
      console.log(data, "data123456789123456789");
      return createConnection({
        senderId: userId, // login user id
        senderType: capitalize(userRole), // login user role
        reciverId: data.id, // sender id
        reciverType: capitalize(data.role), // sender role
      });
    },
    onMutate: () => {
      const toastId = toast.loading(t("sendingRequest"), {
        autoClose: false,
        closeOnClick: false,
      });

      return { toastId };
    },
    onSuccess: (data, _variables, context) => {
      const toastId = context?.toastId;

      if (data?.success) {
        if (toastId) {
          toast.update(toastId, {
            render: t("requestSentSuccess"),
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
          });
        } else {
          toast.success(t("requestSentSuccess"));
        }
        // Only invalidate the userSuggestions query with exact match
        queryClient.invalidateQueries({
          queryKey: ["userSuggestions"],
          exact: true,
        });
      } else {
        const message = data?.message || t("requestSendFailed");
        if (toastId) {
          toast.update(toastId, {
            render: message,
            type: "error",
            isLoading: false,
            autoClose: 4000,
            closeOnClick: true,
          });
        } else {
          toast.error(message);
        }
      }
    },
    onError: (error, _variables, context) => {
      const errorMessage = error?.response?.data?.message || t("somethingWentWrong");
      const toastId = context?.toastId;

      if (toastId) {
        toast.update(toastId, {
          render: `${t("error")}: ${errorMessage}`,
          type: "error",
          isLoading: false,
          autoClose: 4000,
          closeOnClick: true,
        });
      } else {
        toast.error(`${t("error")}: ${errorMessage}`);
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      const toastId = context?.toastId;
      if (toastId) {
        setTimeout(() => toast.dismiss(toastId), 4500);
      }
    },
  });
};

export const useRemoveConnection = () => {
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const userRole = Cookies.get("userRole");
  const { connections, setConnections } = useConnectionsStore();
  const t = useTranslations("Connections");

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
        toast.success(t("connectionRemovedSuccess"));
        const updatedConnections = connections.filter((conn) => conn._id !== variables.id);
        setConnections(updatedConnections);
      } else {
        toast.error(data?.message || t("connectionRemoveFailed"));
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || t("somethingWentWrong");
      toast.error(`${t("error")}: ${errorMessage}`);
    },
  });
};

// New: useOthersUserConnections
export const useOthersUserConnections = (page, limit, options = {}) => {
  const userId = options.userId || Cookies.get("userId"); // viewer
  const profileId = options.profileId;
  const userType = options.userType || capitalize(Cookies.get("userRole"));
  const { connections, setConnections, setPagination, setHasMore } = useConnectionsStore();
  const t = useTranslations("Connections");

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
      throw new Error(res?.message || t("fetchFailed"));
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
  const t = useTranslations("Connections");

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
      throw new Error(res?.message || t("fetchFailed"));
    },
    enabled: !!userId && !!profileId && !!userType && !!page,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...options,
  });
};
