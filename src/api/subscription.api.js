import { axiosInstance } from "./axios";

export const purchasePlan = async (data) => {
  try {
    const response = await axiosInstance.post("/purchase-plan", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
