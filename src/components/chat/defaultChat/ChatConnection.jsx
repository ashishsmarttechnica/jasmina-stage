"use client";

import useChatDndStore from "@/store/chatDnd.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Toggle } from "rsuite";
import CommonTitle from "../../../common/CommonTitle";
import useAuthStore from "../../../store/auth.store";
import { getChatSocket } from "../../../utils/socket";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import DefaultChatView from "./DefaultChatView";
// import ChatSidebarDefault from "./ChatSidebarDefault";

// Dummy chat data
const dummyChats = {
  conversations: [
    {
      id: 1,
      name: "Amit Sharma",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessageTime: "10:30 AM",
      messages: [
        {
          from: "user",
          text: "Hi Amit!",
          timestamp: new Date().toISOString(),
        },
        {
          from: "other",
          text: "Hello! How can I help you?",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "UI/UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      lastMessageTime: "Yesterday",
      messages: [
        {
          from: "user",
          text: "Hi Priya, can you share the latest design?",
          timestamp: new Date().toISOString(),
        },
        {
          from: "other",
          text: "Sure, sending it now!",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "Backend Developer",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      lastMessageTime: "2 days ago",
      messages: [
        {
          from: "user",
          text: "API integration done?",
          timestamp: new Date().toISOString(),
        },
        {
          from: "other",
          text: "Yes, please check now.",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ],
};

const ChatConnection = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const t = useTranslations("Chat");
  const {
    switchOn: dndSwitchOn,
    checkDnd,
    checkCompanyDnd,
    updateDndMode,
    loading,
    initializeDnd,
    dndError,
  } = useChatDndStore();
  // console.log(dndSwitchOn, "dcdklfsh;;;;;;f;;;;;;;;;;;;;;;");
  const { user } = useAuthStore();
  const isLoggedInUser = (user?.role || "").toLowerCase() === "user";

  const userId = Cookies.get("userId");
  const searchParams = useSearchParams();
  console.log(searchParams, "searchParamssearchParams+++++");
  const targetRoomId = searchParams?.get("roomId");

  // Initialize DND state when component mounts to prevent flicker
  useEffect(() => {
    if (userId && !isLoggedInUser) {
      initializeDnd();
    }
  }, [userId, isLoggedInUser, initializeDnd]);

  const handleSelectChat = (chat) => {
    console.log(chat, "chatchatchat");

    // Set active chat
    setActiveChat(chat);

    // For company chats, check current DND mode on selection
    if (chat?.companyName && userId && chat?.conversationId) {
      checkDnd(userId, chat.conversationId);
      // console.log(chat?.conversationId, "lllllllllll=======+++++");
    }
  };

  // Also re-check DND whenever the active chat changes (covers refresh + later updates)
  useEffect(() => {
    if (activeChat?.companyName && userId && activeChat?.conversationId) {
      checkDnd(userId, activeChat.conversationId);
    }
  }, [activeChat?.conversationId, activeChat?.companyName, userId, checkDnd]);

  // Check initial DND status when component mounts (for page refresh scenarios)
  useEffect(() => {
    if (userId && !isLoggedInUser) {
      // For company users, check DND status on mount using company ID
      // Use the user ID as the company ID since it's the same for company users
      // This will override any stale persisted state with fresh server data
      checkCompanyDnd(userId);
    }
  }, [userId, isLoggedInUser, checkCompanyDnd]);

  // Sync persisted state with server state when component mounts
  useEffect(() => {
    if (userId && !isLoggedInUser && dndSwitchOn !== null) {
      // If we have persisted state, still check with server to ensure it's current
      // This handles cases where the persisted state might be stale
      const syncWithServer = async () => {
        await checkCompanyDnd(userId);
      };
      syncWithServer();
    }
  }, [userId, isLoggedInUser, dndSwitchOn, checkCompanyDnd]);

  const handleBackToSidebar = () => {
    setActiveChat(null);
  };

  // Bump sidebar refresh key to force ChatSidebar to refetch conversations
  const triggerSidebarRefresh = () => setSidebarRefreshKey((k) => k + 1);

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
        // console.log("[ChatConnection] DND update emitted via socket:", { companyId, dndEnabled });
      } else if (socket) {
        // If socket not connected, connect first then emit
        socket.once("connect", () => {
          socket.emit("dnd_update", {
            companyId: companyId,
            dndEnabled: dndEnabled,
            timestamp: new Date().toISOString(),
          });
          // console.log("[ChatConnection] DND update emitted after socket connect:", { companyId, dndEnabled });
        });
        socket.connect();
      }
    } catch (error) {
      console.error("[ChatConnection] Error emitting DND update via socket:", error);
    }
  };

  return (
    <div>
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <div className="flex flex-col rounded-md bg-white sm:h-[750px] md:w-full xl:w-[829px] xl:max-w-[829px]">
          <div className="">
            <CommonTitle
              className="hidden md:block"
              title={t("title")}
              right={
                !isLoggedInUser ? (
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

                            // Emit DND update to all connected users via socket
                            await emitDndUpdateToUsers(user?._id, checked);

                            // Re-fetch company DND status to ensure UI reflects persisted value after refresh
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
                ) : null
              }
            />
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div
              className={`h-full w-full overflow-hidden border-r border-slate-200 md:max-w-[276.5px] ${activeChat ? "hidden md:block" : "block"
                }`}
            >
              <ChatSidebar
                onSelect={handleSelectChat}

                activeChat={activeChat}
                targetRoomId={targetRoomId}
                refreshKey={sidebarRefreshKey}
                setRefreshKey={setSidebarRefreshKey}
              />
            </div>

            <div className={`w-full md:w-full ${activeChat ? "block" : "hidden"} h-full md:block`}>
              {activeChat ? (
                <ChatWindow
                  chat={activeChat}
                  onBack={handleBackToSidebar}
                  onActivity={triggerSidebarRefresh}
                />
              ) : (
                <DefaultChatView />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatConnection;
