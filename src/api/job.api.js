import axios from "@/lib/axios";

export const createJob = async (data) => {
  const res = await axios.post("/create/job", data);
  return res.data;
};
export const getRecentJobs = async (userId) => {
  const res = await axios.get(`/recent/job?userId=${userId}`);
  return res.data;
};

export const getJobs = async ({
  search = "",
  location = "",
  lgbtq,
  page = 1,
  limit = 100,
} = {}) => {
  const params = new URLSearchParams();

  // Always add search parameter (even if empty)
  params.append("search", search);

  // Always add location parameter (even if empty)
  params.append("location", location);

  // Add lgbtq parameter if it's defined (true/false)
  if (lgbtq !== undefined) {
    params.append("lgbtq", lgbtq);
  }

  // Always add page and limit
  params.append("page", page);
  params.append("limit", limit);

  const url = `/search/job?${params.toString()}`;
 // console.log("API Call URL:", url);

  const res = await axios.get(url);
 // console.log("API Response:", res.data);
  return res.data;
};

export const saveJob = async ({ jobId, userId }) => {
  const res = await axios.post("/save/job", { jobId, userId });
  return res.data;
};
export const removeJob = async ({ jobId, userId }) => {
  const response = await axios.delete(`/remove/job`, {
    data: { jobId, userId },
  });
  return response.data;
};

export const getSavedJobs = async (userId) => {
  const res = await axios.get(`/get/save/job?id=${userId}`);
  return res.data;
};

export const getSavedJob = async (id) => {
  const res = await axios.get(`/get/save/job?id=${id}`);
  return res.data;
};

export const getAppliedJobs = async ({ userId, page = 1, limit = 10 }) => {
  const params = new URLSearchParams();
  params.append("id", userId);
  params.append("page", page);
  params.append("limit", limit);
  const res = await axios.get(`/get/applied/job?${params.toString()}`);
  return res.data;
};

export const applyJob = async (data) => {
  const res = await axios.post("/apply/job", data);
  return res.data;
};

export const updateJobStatus = async ({ jobId, status }) => {
 // console.log("updateJobStatus API called with:", { jobId, status }); // Debug log
  const res = await axios.put(`/update/job?jobId=${jobId}`, { status });
 // console.log("updateJobStatus API response:", res.data); // Debug log
  return res.data;
};

export const updateApplicationStatus = async ({ userId, jobId, status }) => {
  const res = await axios.post("/update-applied-job", { userId, jobId, status });
  return res.data;
};

export const getSingleJob = async (jobId) => {
  const res = await axios.get(`/get/single/job?id=${jobId}`);
  return res.data;
};

export const searchGlobalJobs = async ({
  search = "",
  location = "",
  lgbtq,
  page = 1,
  limit = 10,
} = {}) => {
  const params = new URLSearchParams();
  params.append("search", search);
  params.append("location", location);
  if (lgbtq !== undefined) params.append("lgbtq", lgbtq);
  params.append("page", page);
  params.append("limit", limit);

  const res = await axios.get(`/global/searchJob?${params.toString()}`);
  return res.data;
};
