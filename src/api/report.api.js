import axios from "@/lib/axios";

export const createReport = async (data) => {
  const res = await axios.post("/create/report", data);
  return res.data;
};

export const createPostReport = async (data) => {
  const res = await axios.post("/create/post/report", data);
  return res.data;
};
