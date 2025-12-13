"use client";
import { getConversations } from "@/api/chat.api";
import getImg from "@/lib/getImg";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import ImageFallback from "../../../common/shared/ImageFallback";
import useAuthStore from "../../../store/auth.store";
import useChatDndStore from "../../../store/chatDnd.store";

// 🟢 socket utils import
// import { getChatSocket } from "@/utils/getChatSocket";
import { AnimatePresence, motion } from "framer-motion";
import { LuSearch } from "react-icons/lu";
import { toast } from "react-toastify";
import { Toggle } from "rsuite";
import { getChatSocket } from "../../../utils/socket";
import Search from "./Search";

export default function ChatSidebar({ onSelect, activeChat, refreshKey, setRefreshKey, targetRoomId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [newconversations, setNewConversations] = useState([]);
  const [chatLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const t = useTranslations("Chat");
  const { switchOn: dndSwitchOn, updateDndMode, loading, checkCompanyDnd } = useChatDndStore();
  const isLoggedInUser = (user?.role || "").toLowerCase() === "user";
  // console.log(newconversations, "conversationsconversations");
  // console.log(conversations, "conversationsconversations");

  const userId = Cookies.get("userId");
  // const [getConversations,setConversations] = useState([]);   
  // 🟢 har chat ke liye socket ref
  const chatSocketRef = useRef(null);
  const itemRefs = useRef({});
  const autoSelectedRef = useRef(false);
  useEffect(() => {
    if (!user?._id) return;

    const chatSocket = getChatSocket(user._id);
    // console.log("[ChatSidebar] Setting up socket for user:", user._id);

    if (chatSocket) {
      if (!chatSocket.connected) {
        chatSocket.connect();
      }

      chatSocket.emit("register", user._id);

      chatSocket.on("connect", () => {
        // console.log("[ChatSidebar] ✅ Socket connected");
      });

      // 🔔 new_notification
      chatSocket.on("new_notification", (data) => {
        // console.log("[ChatSidebar] 🔔 new notification received:", data);

        setConversations((prev) => {
          const exists = prev.find((c) => c.roomId === data.roomId);
          if (exists) {
            return prev.map((c) =>
              c.roomId === data.roomId
                ? { ...c, hasUnread: data.hasUnread, chatCount: data.chatCount }
                : c
            );
          }
          return [
            {
              _id: data.roomId,
              roomId: data.roomId,
              title: data.title,
              profileImage: data.profileImage,
              hasUnread: data.hasUnread,
              chatCount: data.chatCount,
              sender: { _id: data.fromUserId },
              receiver: { _id: data.toUserId },

            },
            ...prev,
          ];
        });
      });

      // 🔄 update_hasUnread
      chatSocket.on("update_hasUnread", (data) => {
        // console.log("[ChatSidebar] 🔄 update_hasUnread received for roomId:", data?.roomId);

        // ✅ newconversations state update karo
        setNewConversations((prev) => {
          const exists = prev.find((c) => c.roomId === data.roomId);
          if (exists) {
            return prev.map((c) =>
              c.roomId === data.roomId
                ? { ...c, hasUnread: data.hasUnread, chatCount: data.chatCount }
                : c
            );
          }
          return [
            {
              _id: data.roomId,
              roomId: data.roomId,
              hasUnread: data.hasUnread,
              chatCount: data.chatCount,
            },
            ...prev,
          ];
        });

        // ✅ conversations state bhi update karo
        setConversations((prev) =>
          prev.map((c) =>
            c.roomId === data.roomId
              ? { ...c, hasUnread: data.hasUnread, chatCount: data.chatCount }
              : c
          )
        );
      });

      chatSocket.on("error", (error) => {
        console.error("[ChatSidebar] Socket error:", error);
      });

      return () => {
        chatSocket.off("connect");
        chatSocket.off("new_notification");
        chatSocket.off("update_hasUnread");
        chatSocket.off("disconnect");
        chatSocket.off("error");
      };
    }
  }, [user?._id]);

  const getOtherUser = (conversation) => {
    if (!conversation) return null;
    const sender = conversation.sender;
    const receiver = conversation.receiver;

    const currentId = String(userId || "");
    const senderId = sender?.id || sender?._id;
    const receiverId = receiver?.id || receiver?._id;

    // console.log("🔍 getOtherUser - Current ID:", currentId);
    // console.log("🔍 getOtherUser - Sender ID:", senderId);
    // console.log("🔍 getOtherUser - Receiver ID:", receiverId);

    if (String(senderId || "") === currentId) {
      // console.log("🔍 Returning receiver:", receiver);
      return receiver;
    }
    if (String(receiverId || "") === currentId) {
      // console.log("🔍 Returning sender:", sender);
      return sender;
    }
    // console.log("🔍 Returning fallback:", receiver || sender);
    return receiver || sender;
  };

  const fetchConversations = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getConversations(userId);
      if (response.success) {
        setConversations(response.data.results || []);
      } else {
        setError("Failed to fetch conversations");
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err.message || "Failed to fetch conversations");
      if (setRefreshKey) {
        setTimeout(() => {
          setRefreshKey((prev) => prev + 1);
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId, refreshKey]);

  // Auto-select chat when targetRoomId matches a conversation
  useEffect(() => {
    if (!targetRoomId || chatLoading || conversations.length === 0) return;

    // Reset auto-selected flag if targetRoomId changes
    if (autoSelectedRef.current && activeChat?.roomId !== targetRoomId) {
      autoSelectedRef.current = false;
    }

    // Skip if already auto-selected for this targetRoomId
    if (autoSelectedRef.current) return;

    // Find conversation matching targetRoomId
    const matchingConversation = conversations.find(
      (conv) => conv.roomId === targetRoomId
    );

    // Only auto-select if:
    // 1. Matching conversation found
    // 2. Not already the active chat
    if (
      matchingConversation &&
      (!activeChat || activeChat.roomId !== targetRoomId)
    ) {
      // Scroll the sidebar to the matching conversation
      const el = itemRefs.current[matchingConversation.roomId];
      if (el && typeof el.scrollIntoView === "function") {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
      }

      // console.log("[ChatSidebar] Auto-selecting chat from URL:", targetRoomId);
      autoSelectedRef.current = true;
      handleChatSelect(matchingConversation);
    }
  }, [targetRoomId, conversations, chatLoading, activeChat]);

  // 🟢 safe string conversion
  const toLowerSafe = (value) => {
    if (typeof value === "string") return value.toLowerCase();
    if (value === null || value === undefined) return "";
    try {
      return String(value).toLowerCase();
    } catch {
      return "";
    }
  };

  const handleChatSelect = (conversation) => {
    // console.log("🎯 Selecting chat:", conversation);
    // console.log("🎯 Conversation roomId:", conversation.roomId);

    const otherUser = getOtherUser(conversation);
    // console.log("🎯 Other user:", otherUser);

    const selectedChat = {
      id: conversation.roomId,
      name: otherUser?.userName || otherUser?.companyName,
      role: otherUser?.jobRole || otherUser?.industryType,
      avatar: otherUser?.photo
        ? getImg(otherUser.photo)
        : otherUser?.logoUrl
          ? getImg(otherUser.logoUrl)
          : "/no-img.png",
      messages: [],
      conversationId: otherUser?.id || otherUser?._id,
      roomId: conversation.roomId,
      sender: conversation.sender?.id,
      receiver: conversation.receiver?.id,
      companyName: otherUser?.companyName,
      companyId: otherUser?.companyName ? (otherUser?.id || otherUser?._id) : null,
      fromConnections: conversation.connectionStatus === "connected",
    };

    // console.log("🎯 Selected chat object:", selectedChat);

    // 🔴 Close previous chat if exists
    if (activeChat?.roomId && chatSocketRef.current) {
      chatSocketRef.current.emit("close_chat", activeChat.roomId);
      // console.log("📴 Closed previous chat:", activeChat.roomId);
    }

    // 🟢 Get or create socket for current user
    const chatSocket = getChatSocket(user._id);

    if (!chatSocket.connected) {
      chatSocket.connect();
    }

    // 🟢 Open the selected chat
    chatSocket.emit("open_chat", selectedChat.roomId);
    // console.log("🟢 Opened chat:", selectedChat.roomId);

    // Mark ALL messages as read when chat is opened
    const currentUserId = userId;
    const otherUserId = otherUser?.id || otherUser?._id;

    // Update hasUnread to mark ALL users' messages as read when chat is opened
    const updatedHasUnread = {
      ...conversation.hasUnread,
      [currentUserId]: false, // Mark current user as read
      [otherUserId]: false,   // Mark other user as read too
    };

    // Update both states to reflect read status
    setConversations((prev) =>
      prev.map((c) =>
        c.roomId === selectedChat.roomId ? { ...c, hasUnread: updatedHasUnread } : c
      )
    );

    setNewConversations((prev) =>
      prev.map((c) =>
        c.roomId === selectedChat.roomId ? { ...c, hasUnread: updatedHasUnread } : c
      )
    );

    // Store socket reference
    chatSocketRef.current = chatSocket;

    // 🎯 Set active chat - THIS IS THE KEY FIX
    onSelect(selectedChat);
    // console.log("✅ Chat selected and set as active:", selectedChat.roomId);
  };

  const filteredConversations = conversations.filter((conversation) => {
    const searchTerm = toLowerSafe(searchQuery);
    const otherUser = getOtherUser(conversation);

    const name =
      toLowerSafe(otherUser?.userName) || toLowerSafe(otherUser?.companyName);
    const role =
      toLowerSafe(otherUser?.jobRole) || toLowerSafe(otherUser?.industryType);

    return name.includes(searchTerm) || role.includes(searchTerm);
  });

  // Function to emit DND update to all connected users via socket
  const emitDndUpdateToUsers = async (companyId, dndEnabled) => {
    try {
      const socket = getChatSocket(userId);
      if (socket && socket.connected) {
        // Emit dnd_update event to notify all connected users about DND state change
        socket.emit("dnd_update", {
          companyId: companyId,
          dndEnabled: dndEnabled,
          timestamp: new Date().toISOString(),
        });
        // console.log("[ChatSidebar] DND update emitted via socket:", { companyId, dndEnabled });
      } else if (socket) {
        // If socket not connected, connect first then emit
        socket.once("connect", () => {
          socket.emit("dnd_update", {
            companyId: companyId,
            dndEnabled: dndEnabled,
            timestamp: new Date().toISOString(),
          });
          // console.log("[ChatSidebar] DND update emitted after socket connect:", { companyId, dndEnabled });
        });
        socket.connect();
      }
    } catch (error) {
      console.error("[ChatSidebar] Error emitting DND update via socket:", error);
    }
  };

  // cleanup (component unmount hone pe)
  useEffect(() => {
    return () => {
      if (chatSocketRef.current) {
        chatSocketRef.current.disconnect();
        chatSocketRef.current = null;
      }
    };
  }, []);
  // console.log(activeChat?.conversationId, "setConversationssetConversations");
  // console.log(newconversations, "newconversationsnewconversations|||||||||||||");


  // console.log(result, "resultresultresult");
  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto bg-white md:border-r md:border-[#000000]/10 xl:w-[275.5px]">
      {/* baaki UI code same hi hai */}
      <AnimatePresence mode="wait">
        {!searchVisible && !isLoggedInUser ? (
          <motion.div
            key="header-bar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sticky top-0 z-1 bg-white p-3.5 py-[20px] md:border-b md:border-[#000000]/10 md:hidden border-b-2 border-gray/50"
          >
            <div className="flex justify-between">
              <LuSearch
                className="w-[20px] h-[20px] text-[#888DA8] cursor-pointer"
                onClick={() => setSearchVisible(true)}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">{t("DoNotDisturb")}</span>
                <Toggle
                  checked={dndSwitchOn}
                  onChange={async (checked) => {
                    try {
                      const ok = await updateDndMode(user?._id, checked);
                      if (!ok) {
                        toast.error(t("dndUpdateFailed"));
                      } else {
                        toast.success(checked ? t("dndEnabled") : t("dndDisabled"));
                        await emitDndUpdateToUsers(user?._id, checked);

                        if (userId && !isLoggedInUser) {
                          await checkCompanyDnd(userId);
                        }
                      }
                    } catch (error) {
                      console.error("Failed to update DND mode:", error);
                      toast.error("Failed to update DND mode. Please try again.");
                    }
                  }}
                  size="md"
                  disabled={loading}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="search-bar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`sticky top-0 z-1 bg-white p-3.5 pb-[20px] md:border-b md:border-[#000000]/10 ${isLoggedInUser ? 'hidden' : 'md:hidden'} border-b-2 border-gray/50`}
          >
            <div className="flex w-full items-center gap-2">
              <Search
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("sidebar.searchPlaceholder")}
                className="w-full"
              />
              <motion.button
                className="text-sm text-gray-600"
                onClick={() => setSearchVisible(false)}
                whileTap={{ scale: 0.9 }}
                initial={{ rotate: 0 }}
                animate={{ rotate: 90 }}
                exit={{ rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`sticky top-0 z-10 bg-white p-3.5 pb-[20px] md:border-b md:border-[#000000]/10 ${isLoggedInUser ? 'block border-b-2 border-gray/50' : 'hidden'} md:block`}>
        <Search
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("sidebar.searchPlaceholder")}
        />
      </div>
      {chatLoading ? (
        <div className="p-4 text-center text-gray-400">{t("sidebar.loading")}</div>
      ) : filteredConversations.length === 0 ? (
        <div className="p-4 text-center text-gray-400">{t("sidebar.empty")}</div>
      ) : (
        filteredConversations.map((conversation) => {

          const otherUser = getOtherUser(conversation);
          // console.log(conversation, "conversation++++++++++++++++");
          // console.log(otherUser, "otherUserotherUser");

          const conversationHasUnread = conversation.hasUnread || {};
          const otherUserId = otherUser?.id || otherUser?._id;


          const selectedChat = activeChat;
          // console.log(selectedChat, "selectedChatselectedChatselectedChat");

          // console.log(selectedChat, "selectedChatselectedChat___________");
          const senderId = selectedChat?.sender
          const receiverId = selectedChat?.receiver

          // const currentUserId = userId; // logged-in user
          const currentUserId = userId; // logged-in user

          // Show "New" only if OTHER users have unread messages (not current user)
          const hasUnread = conversation.hasUnread &&
            Object.entries(conversation.hasUnread).some(([userId, isUnread]) =>
              userId !== currentUserId && isUnread === true
            );

          // console.log(hasUnread, "hasUnreadhasUnreadhasUnread");



          return (
            <div
              key={conversation._id}
              ref={(el) => {
                if (el) {
                  itemRefs.current[conversation.roomId] = el;
                }
              }}
              onClick={() => handleChatSelect(conversation)}
              className={`flex cursor-pointer items-center gap-3 border-b border-slate-200 p-3 py-4 hover:bg-gray-100 ${activeChat?.id === conversation.roomId ? "bg-gray-100" : ""
                }`}
            >
              <ImageFallback
                src={
                  otherUser?.photo
                    ? getImg(otherUser.photo)
                    : otherUser?.logoUrl
                      ? getImg(otherUser.logoUrl)
                      : "/no-img.png"
                }
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium">
                  <span>{otherUser?.userName || otherUser?.companyName}</span>

                  {hasUnread && (
                    <button className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      New
                    </button>
                  )}

                </div>
                <div className="text-xs text-gray-500">
                  {otherUser?.jobRole || otherUser?.industryType}
                </div>
              </div>
            </div>
          );
        })

      )}
    </div>
  );
}