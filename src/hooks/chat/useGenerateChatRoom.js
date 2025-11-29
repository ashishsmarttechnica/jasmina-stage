import { generateChatRoom } from "@/api/chat.api";
import { useMutation } from "@tanstack/react-query";

export const useGenerateChatRoom = () => {
  return useMutation({
    mutationFn: generateChatRoom,
  });
};
