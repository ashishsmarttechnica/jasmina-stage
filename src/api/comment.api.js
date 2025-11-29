import axios from "@/lib/axios";

export const getAllComments = async (postId, viewerId, page, limit = 10) => {
  const res = await axios.get(
    `/get/comments?postId=${postId}&viewerId=${viewerId}&page=${page}&limit=${limit}`
  );
  return res.data;
};

export const createComment = async (data) => {
  const res = await axios.post("/create/comment", data);
  return res.data;
};
