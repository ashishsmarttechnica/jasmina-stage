import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import capitalize from "@/lib/capitalize";

export const getNetworkInvites = async ({page, limit}) => {
  const userId = Cookies.get("userId");
  const userType = capitalize(Cookies.get("userRole"));

  try {
    const response = await axiosInstance.get(
      `/get/pending/connection?userId=${userId}&userType=${userType}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
