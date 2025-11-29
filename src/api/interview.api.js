import axios from "@/lib/axios";

export const getAllInterviews = async ({ page = 1, limit = 10000000, status = 0, companyId }) => {
  try {
    const response = await axios.get(
      `/applied-interviews?page=${page}&limit=${limit}&status=${status}&companyId=${companyId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const scheduleInterview = async (data) => {
  try {
    const response = await axios.post("/interview/apply", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelInterview = async (interviewId) => {
  try {
    const response = await axios.delete(`cancel/interview?interviewId=${interviewId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateInterview = async ({ interviewId, data }) => {
  try {
    const response = await axios.put(`/update/interview?interviewId=${interviewId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
