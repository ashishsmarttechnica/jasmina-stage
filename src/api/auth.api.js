import axios from "@/lib/axios";

export const loginUser = async (data) => {
  const res = await axios.post("/login", data);
  return res.data;
};


export const signupUser = async (data) => {
  const endpoint = data.accountType === "Company" ? "/create/company" : "/create/user";
  const res = await axios.post(endpoint, data);
  return res.data;
};

export const verifyOtp = async ({ email, otp }) => {
  const res = await axios.post("/verify/otp", { email, otp });
  return res.data;
};

export const resendOtp = async ({ email }) => {
  const res = await axios.post("/resend/otp", { email });
  return res.data;
};

export const getUser = async (id, userId) => {
  const res = await axios.get(
    `/get/profile/?profileId=${id}${userId ? `&viewerId=${userId}` : ""}`
  );
  return res.data;
};

export const updateUserProfile = async ({ data, userId }) => {
  const res = await axios.put(`/update/user/?id=${userId}`, data);
  return res.data;
};

export const forgotPassword = async ({ email, newPassword }) => {
  const res = await axios.post("/forgot/password", {
    email,
    password: newPassword,
    cpassword: newPassword,
  });
  return res.data;
};

export const resetPassword = async ({ id, currentPassword, newPassword }) => {
  const res = await axios.post("/reset/password", {
    id,
    currentPassword,
    password: newPassword,
    cpassword: newPassword,
  });
  return res.data;
};
