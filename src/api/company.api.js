import axios from "@/lib/axios";

export const updateCompanyProfile = async ({ data, userId }) => {
  const res = await axios.put(`/update/company/?id=${userId}`, data);
  return res.data;
};

export const updateCompanyDndMode = async ({ companyId, dndEnabled }) => {
  try {
    // console.log("Company API - updateCompanyDndMode called with:", { companyId, dndEnabled });

    const formData = new FormData();
    formData.append("dndEnabled", dndEnabled);

    // console.log("Company API - FormData created:", formData);
    // console.log("Company API - Making PUT request to:", `/update/company?id=${companyId}`);

    const response = await axios.put(`/update/company?id=${companyId}`, formData);
    // console.log("Company API - Response received:", response);
    // console.log("Company API - Response data:", response.data);

    return response.data;
  } catch (error) {
    console.error("Company API - Error in updateCompanyDndMode:", error);
    throw error;
  }
};

export const getCompany = async (id, viewerId) => {
  const res = await axios.get(`/get/company/profile?profileId=${id}${viewerId ? `&viewerId=${viewerId}` : ""}`);
  //// console.log("API response:", res.data); // log the entire response
  return res.data;
};

// export const getAllCompanyPosts = async (page = 1, limit = 4) => {
//   const res = await axios.get(`user/home/page?page=${page}&limit=${limit}`);
//   return res.data;
// };

// export const getPostCompanyById = async (id) => {
//   const res = await axios.get(`user/home/page?id=${id}`);
//   return res.data;
// };

// export const createCompanyPost = async (data) => {
//   const res = await axios.post("/create/post", data);
//   return res.data;
// };

export const getCompanyAppliedJob = async (id, search = "", status, page = 1, limit = 100) => {
  const res = await axios.get(
    `/getcompany/job?id=${id}&search=${search}&status=${status}&page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getAllApplicants = async (jobId, page = 1, limit = 10) => {
  const res = await axios.get(
    `/job/applications?jobId=${jobId}&page=${page}&limit=${limit}`
  );
  return res.data;
};

export const checkCompanyVerification = async (companyId) => {
  const response = await axios.get(`/isVerified?companyId=${companyId}`);
  return response.data;
};
