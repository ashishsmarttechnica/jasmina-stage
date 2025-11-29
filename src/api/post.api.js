import axios from "@/lib/axios";
import Cookies from "js-cookie";
export const getAllPosts = async (page = 1, limit = 15) => {
  const res = await axios.get(
    `user/home/page?page=${page}&limit=${limit}&viewerId=${Cookies.get("userId")}`
  );
  return res.data;
};

export const getPostById = async (id) => {
  const res = await axios.get(`user/home/page?id=${id}`);
  return res.data;
};

export const createPost = async (data) => {
  const res = await axios.post("/create/post", data);
  return res.data;
};

export const likePost = async (id) => {
  const role = Cookies.get("userRole");
  const normalizedRole = (() => {
    if (!role) return undefined;
    const lower = String(role).trim().toLowerCase();
    if (lower === "user") return "User";
    if (lower === "company") return "Company";
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  })();
  const res = await axios.post(`/toggleLike`, {
    postId: id,
    userId: Cookies.get("userId"),
    userType: normalizedRole,
  });
  return res.data;
};

export const getLikeUsers = async (id, page = 1, limit = 10) => {
  const viewerId = Cookies.get("userId");
  const query = new URLSearchParams({
    postId: id,
    viewerId: viewerId || "",
    page: String(page),
    limit: String(limit),
  });

  const res = await axios.get(`/get/likes?${query.toString()}`);
  return res.data;
};

export const unlikePost = async (id) => {
  const role = Cookies.get("userRole");
  const normalizedRole = (() => {
    if (!role) return undefined;
    const lower = String(role).trim().toLowerCase();
    if (lower === "user") return "User";
    if (lower === "company") return "Company";
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  })();
  const res = await axios.post(`/toggleLike`, {
    postId: id,
    userId: Cookies.get("userId"),
    userType: normalizedRole,
  });
  return res.data;
};

// export const SinglePost = async (id) => {
//   const res = await axios.get(`/get/single/post?id=${id}`, {
//     postId: id,
//     userId: Cookies.get("postId"),
//   });
// };
export const SinglePostById = async (id) => {
  const res = await axios.get(`/get/single/post`, {
    params: { id },
  });
  return res.data;
};

export const postShare = async (id) => {
  const res = await axios.get(`/share/post?postId=${id}`);
  return res.data;
};
