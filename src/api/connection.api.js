import axios from "@/lib/axios";

export const createConnection = async (data) => {
  try {
    const response = await axios.post("/create/connection", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConnections = async ({
  userId,
  userType,
  page = 1,
  limit = 10,
  connectionType = "User",
}) => {
  const res = await axios.get(
    `/get/connection?userId=${userId}&userType=${userType}&page=${page}&limit=${limit}&filterType=${connectionType}`
  );
  return res.data;
};

export const getCompanyConnections = async ({
  userId,
  userType,
  page = 1,
  limit = 10,
  connectionType = "Company",
}) => {
  const res = await axios.get(
    `/get/connection?userId=${userId}&userType=${userType}&page=${page}&limit=${limit}&filterType=${connectionType}`
  );
  return res.data;
};
export const acceptConnection = async (data) => {
  try {
    const res = await axios.post("accept/connection", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const rejectConnection = async (data) => {
  try {
    const res = await axios.post("reject/connection", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeConnection = async (data) => {
  try {
    const res = await axios.post("remove/connection", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getOthersConnection = async ({ viewerId, profileId }) => {
  try {
    const res = await axios.get(
      `/get/others/connection?viewerId=${viewerId}&profileId=${profileId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getOthersCompanyConnections = async ({
  userId,
  profileId,
  userType ,
  filterType = "Company",
  page = 1,
  limit = 10,
}) => {
  try {
    const res = await axios.get(
      `/get/others/connection?userType=${userType}&filterType=${filterType}&page=${page}&limit=${limit}&userId=${userId}&profileId=${profileId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getOthersUserConnections = async ({
  userId,
  profileId,
  userType,
  filterType = "User",
  page = 1,
  limit = 10,
}) => {
  try {
    const res = await axios.get(
      `/get/others/connection?userType=${userType}&filterType=${filterType}&page=${page}&limit=${limit}&userId=${userId}&profileId=${profileId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
