import axiosInstance from "@/lib/axios";

export const getNotifications = async (viewerId, page = 1, limit = 5) => {
  try {
    const response = await axiosInstance.get(
      `/notification?viewerId=${viewerId}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
