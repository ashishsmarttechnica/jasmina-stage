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
import { getChatSocket } from "@/utils/getChatSocket";
import { AnimatePresence, motion } from "framer-motion";
import { LuSearch } from "react-icons/lu";
import { Toggle } from "rsuite";
import Search from "./Search";

export default function ChatSidebarDefault({ onSelect, activeChat, refreshKey, setRefreshKey }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchVisible, setSearchVisible] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [newconversations, setNewConversations] = useState([]);
    const [chatLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const t = useTranslations("Chat");

    const { switchOn: dndSwitchOn, updateDndMode, loading, checkCompanyDnd } = useChatDndStore();
    const { user } = useAuthStore();
    const isLoggedInUser = (user?.role || "").toLowerCase() === "user";

    const userId = Cookies.get("userId");

    // 🟢 har chat ke liye socket ref
    const chatSocketRef = useRef(null);

    // 🔔 Listen for global new_notification updates (like ChatSidebar)
    useEffect(() => {
        if (!user?._id) return;

        const chatSocket = getChatSocket(user._id);
        if (!chatSocket) return;

        if (!chatSocket.connected) {
            chatSocket.connect();
        }

        chatSocket.emit("register", user._id);

        const handleNewNotification = (data) => {
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
        };

        chatSocket.on("new_notification", handleNewNotification);

        return () => {
            chatSocket.off("new_notification", handleNewNotification);
        };
    }, [user?._id]);

    // 🔄 Listen for update_hasUnread to sync unread flags and counts
    useEffect(() => {
        if (!user?._id) return;

        const chatSocket = getChatSocket(user._id);
        if (!chatSocket) return;

        if (!chatSocket.connected) {
            chatSocket.connect();
        }

        const handleUpdateHasUnread = (data) => {
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
                        sender: { _id: data.fromUserId },
                        receiver: { _id: data.toUserId },
                    },
                    ...prev,
                ];
            });

        };

        chatSocket.on("update_hasUnread", handleUpdateHasUnread);

        return () => {
            chatSocket.off("update_hasUnread", handleUpdateHasUnread);
        };
    }, [user?._id]);

    const getOtherUser = (conversation) => {
        if (!conversation) return null;
        const sender = conversation.sender;
        const receiver = conversation.receiver;
        const currentId = String(userId || "");
        const senderId = sender?.id || sender?._id;
        const receiverId = receiver?.id || receiver?._id;
        if (String(senderId || "") === currentId) return receiver;
        if (String(receiverId || "") === currentId) return sender;
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
        const otherUser = getOtherUser(conversation);

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
            senderId: conversation.sender?.id,
            receiverId: conversation.receiver?.id,
            companyName: otherUser?.companyName,
            companyId: otherUser?.companyName ? (otherUser?.id || otherUser?._id) : null,
            fromConnections: conversation.connectionStatus === "connected",
        };

        // 🔴 purana socket disconnect karo
        if (chatSocketRef.current) {
            if (activeChat?.roomId) {
                chatSocketRef.current.emit("close_chat", activeChat.roomId);
                console.log("📴 Closed chat:", activeChat.roomId);
            }
            chatSocketRef.current.disconnect();
            console.log("❌ Old socket disconnected");
            chatSocketRef.current = null;
        }

        // 🟢 naya socket connect karo
        const newSocket = getChatSocket(userId);
        newSocket.connect();

        newSocket.on("connect", () => {
            console.log("✅ New socket connected for chat:", selectedChat.roomId);
            newSocket.emit("open_chat", selectedChat.roomId);
            console.log("🟢 Opened chat:", selectedChat.roomId);
        });

        newSocket.on("disconnect", () => {
            console.log("❌ Socket disconnected for chat:", selectedChat.roomId);
        });

        chatSocketRef.current = newSocket;

        // set active chat
        onSelect(selectedChat);
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

    // cleanup (component unmount hone pe)
    useEffect(() => {
        return () => {
            if (chatSocketRef.current) {
                chatSocketRef.current.disconnect();
                chatSocketRef.current = null;
            }
        };
    }, []);
    console.log(newconversations, "newconversationsnewconversationsnewconversations");

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
                    const otherUserId = otherUser?.id || otherUser?._id;
                    const isUnread = conversation.hasUnread && conversation.hasUnread[otherUserId] && Object.values(conversation.hasUnread).some((val) => val === false);
                    console.log(isUnread, "isUnreadisUnreadisUnread");
                    return (
                        <div
                            key={conversation._id}
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
                                <div className="font-medium">
                                    {otherUser?.userName || otherUser?.companyName}
                                </div>
                                {isUnread && (
                                    <button className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                        New
                                    </button>
                                )}
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
