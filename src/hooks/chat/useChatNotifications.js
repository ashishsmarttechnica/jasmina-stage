import { getChatSocket } from "@/utils/socket";
import { useEffect, useRef, useState } from "react";

const useChatNotifications = (userId, user) => {
  const [chatCount, setChatCount] = useState(user?.chatCount || 0);
  const [notificationCount, setNotificationCount] = useState(user?.notificationCount || 0);
  const [socketConnected, setSocketConnected] = useState(false);
  const chatSocketRef = useRef(null);

  // Update local state when user data changes
  useEffect(() => {
    setNotificationCount(user?.notificationCount || 0);
    setChatCount(user?.chatCount || 0);
  }, [user?.notificationCount, user?.chatCount]);

  useEffect(() => {
    if (!userId) {
      console.log("[useChatNotifications] No userId provided:", userId);
      return;
    }

    console.log("[useChatNotifications] Setting up socket for userId:", userId);
    const chatSocket = getChatSocket(userId);
    chatSocketRef.current = chatSocket;

    if (chatSocket) {
      console.log("[useChatNotifications] Socket instance created for userId:", userId);
      console.log("[useChatNotifications] Socket connected status:", chatSocket.connected);

      // Connect if not already connected
      if (!chatSocket.connected) {
        console.log("[useChatNotifications] Connecting socket...");
        chatSocket.connect();
      }

      // Register userId with backend
      console.log("[useChatNotifications] Registering userId:", userId);
      chatSocket.emit("register", userId);

      const handleConnect = () => {
        console.log("[useChatNotifications] Socket Connected ✅ for userId:", userId);
        setSocketConnected(true);
        chatSocket.emit("register", userId);
      };

      const handleDisconnect = () => {
        console.warn("[SOCKET] Disconnected ❌");
        setSocketConnected(false);
      };

      const handleError = (error) => {
        console.error("[SOCKET ERROR]", error);
      };

      const handleNewNotification = (data) => {
        console.log("[useChatNotifications] new_notification →", data, "for userId:", userId);

        // Update notification count from socket
        if (data.notificationCount !== undefined) {
          console.log("[useChatNotifications] Updating notification count to:", data.notificationCount);
          setNotificationCount(data.notificationCount);
        }

        // Update chat count from socket
        if (data.chatCount !== undefined) {
          console.log("[useChatNotifications] Updating chat count to:", data.chatCount);
          setChatCount(data.chatCount);
        }
      };

      const handleUpdateHasUnread = (data) => {
        console.log("[useChatNotifications] update_hasUnread →", data, "for userId:", userId);

        let newChatCount = null;

        // Handle different data structures
        if (data?.chatCount !== undefined) {
          newChatCount = data.chatCount;
        } else if (data?.hasUnread) {
          // Extract chatCount from hasUnread object
          const hasUnreadData = data.hasUnread;
          const userIds = Object.keys(hasUnreadData);

          // Find the current user's chat count
          for (const userId of userIds) {
            if (hasUnreadData[userId]?.chatCount !== undefined) {
              newChatCount = hasUnreadData[userId].chatCount;
              break;
            }
          }
        }

        // Update chat count if found
        if (newChatCount !== null) {
          console.log("[useChatNotifications] Updating chat count from", chatCount, "to", newChatCount);
          setChatCount(newChatCount);
        }
      };

      const handleNotificationCountUpdate = (data) => {
        console.log("[SOCKET] notification_count_update →", data);
        // Update notification count from socket
        if (data.count !== undefined) {
          console.log("[SOCKET] Updating notification count to:", data.count);
          setNotificationCount(data.count);
        }
      };

      const handleChatCountUpdate = (data) => {
        console.log("[SOCKET] chat_count_update →", data);
        // Update chat count from socket
        if (data.count !== undefined) {
          console.log("[SOCKET] Updating chat count to:", data.count);
          setChatCount(data.count);
        }
      };

      // Attach listeners
      console.log("[useChatNotifications] Attaching socket listeners for userId:", userId);
      chatSocket.on("connect", handleConnect);
      chatSocket.on("disconnect", handleDisconnect);
      chatSocket.on("error", handleError);
      chatSocket.on("new_notification", handleNewNotification);
      chatSocket.on("update_hasUnread", handleUpdateHasUnread);
      chatSocket.on("notification_count_update", handleNotificationCountUpdate);
      chatSocket.on("chat_count_update", handleChatCountUpdate);

      // Reconnect health check (every 5s)
      const interval = setInterval(() => {
        if (!chatSocket.connected) {
          console.warn("[SOCKET] Attempting reconnect...");
          chatSocket.connect();
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        if (chatSocket) {
          chatSocket.off("connect", handleConnect);
          chatSocket.off("disconnect", handleDisconnect);
          chatSocket.off("error", handleError);
          chatSocket.off("new_notification", handleNewNotification);
          chatSocket.off("update_hasUnread", handleUpdateHasUnread);
          chatSocket.off("notification_count_update", handleNotificationCountUpdate);
          chatSocket.off("chat_count_update", handleChatCountUpdate);
        }
      };
    }
  }, [userId]);

  return {
    chatCount,
    notificationCount,
    socketConnected,
  };
};

export default useChatNotifications;
