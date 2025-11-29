import { getConversations } from "@/api/chat.api";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useConversationsStore = create(
  devtools(
    (set) => ({
      conversations: [],
      loading: false,
      error: null,
      async fetchConversations(userId) {
        if (!userId) return;
        set({ loading: true, error: null });
        try {
          const response = await getConversations(userId);
          if (response.success) {
            set({ conversations: response.data.results || [] });
          } else {
            set({ error: "Failed to fetch conversations" });
          }
        } catch (err) {
          set({ error: err.message || "Failed to fetch conversations" });
        } finally {
          set({ loading: false });
        }
      },
      setConversations: (conversations) => set({ conversations }),
    }),
    {
      name: "ConversationsStore",
    }
  )
);

export default useConversationsStore;
