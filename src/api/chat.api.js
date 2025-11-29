import axios from "@/lib/axios";

export const generateChatRoom = async ({ userId, profileId }) => {
  try {
    const response = await axios.get(`/generate/room?userId=${userId}&profileId=${profileId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConversations = async (userId) => {
  try {
    const response = await axios.get(`/get/conversations/?userId=${userId}&limit=1000000`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (roomId, limit = 1000000, page = 1,userId) => {
  try {
    const response = await axios.get(`/messages?limit=${limit}&page=${page}&roomId=${roomId}&viewerId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async ({ senderId, receiverId, content, chatFile, chatFiles }) => {
  try {
    const formData = new FormData();
    formData.append("senderId", senderId);
    formData.append("receiverId", receiverId);
    formData.append("content", content);
    if (Array.isArray(chatFiles) && chatFiles.length > 0) {
      chatFiles.forEach((file) => {
        if (file) formData.append("chatFile", file);
      });
    } else if (chatFile) {
      formData.append("chatFile", chatFile);
    }


    const response = await axios.post("/messages", formData);
    // console.log(response)
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check Do Not Disturb mode
export const checkDndMode = async ({ senderId, receiverId }) => {
  try {
    const response = await axios.post("/checkDndMode", {
      senderId,
      receiverId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
