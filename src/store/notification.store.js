import { getNotifications } from "@/api/notification.api";
import { create } from "zustand";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  totalPages: 1,
  hasMore: true,

  fetchNotifications: async (viewerId, page = 1, limit = 15, append = false) => {
    // prevent duplicate calls while already loading
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const res = await getNotifications(viewerId, page, limit);

      const newNotifications = res?.data?.results || [];
      const pagination = res?.data?.pagination || {};

      set((state) => ({
        notifications: append
          ? [...state.notifications, ...newNotifications]
          : newNotifications,
        page: page,
        totalPages: pagination.totalPages || 1,
        hasMore: (pagination.currentPage || page) < (pagination.totalPages || 1),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to fetch notifications", loading: false });
    }
  },
}));

export default useNotificationStore;
