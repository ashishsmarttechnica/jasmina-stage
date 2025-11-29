"use client";
import { getMessages, sendMessage } from "@/api/chat.api";
import useChatDndStore from "@/store/chatDnd.store";
// import { getChatSocket } from "@/utils/getChatSocket";
import { format, isSameDay } from "date-fns";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa6";
import { FiLink } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { RiGalleryLine } from "react-icons/ri";
import { toast } from "react-toastify";
import ImageFallback from "../../../common/shared/ImageFallback";
import getImg from "../../../lib/getImg";
import useAuthStore from "../../../store/auth.store";
import { getChatSocket } from "../../../utils/socket";
import ChatWindowHeader from "./ChatWindowHeader";
export default function ChatWindow({ chat, onBack, onActivity }) {
  //#region all state
  const { user } = useAuthStore();
  // console.log(user, "useruseruser");
  const r = useTranslations("UserProfile.resume");
  const t = useTranslations("Chat");
  const lastReceiverRef = useRef(null);
  const [messageOptionsIdx, setMessageOptionsIdx] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [pendingImages, setPendingImages] = useState([]); // File[] max 2
  const [pendingImagePreviews, setPendingImagePreviews] = useState([]); // string[]
  const [pendingDoc, setPendingDoc] = useState(null); // File | null
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isConnected = chat?.fromConnections;
  const { switchOn: isDndSwitchOn, checkDnd, error: dndError } = useChatDndStore();
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const MAX_TEXTAREA_HEIGHT = 160;
  const hasInitialScrolledRef = useRef(false);
  const isImagePath = (path = "") => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(String(path));
  //// console.log(chat, "messages++++++++++++++");
  // Get current user ID from cookies
  const currentUserId = Cookies.get("userId");
  // Get current user avatar from cookies (ensure this is set at login)
  const currentUserAvatar = Cookies.get("userAvatar");
  // console.log(messages, " messagesss");
  //#endregion

  //#region Watch for DND state changes and broadcast them to backend

  useEffect(() => {
    useChatDndStore.getState().setSwitchOn(false);
  }, []);

  useEffect(() => {
    if (isDndSwitchOn !== undefined) {
      // console.log("[ChatWindow] DND state changed, broadcasting to backend", isDndSwitchOn);

      // Emit DND state change to backend
      const socket = getChatSocket(currentUserId);
      if (socket && socket.connected) {
        try {
          socket.emit("dnd_state_change", {
            userId: currentUserId,
            companyId: chat?.companyName ? chat?.conversationId : currentUserId,
            dndEnabled: isDndSwitchOn,
            conversationId: chat?.conversationId,
            roomId: chat?.roomId,
          });
          // console.log("[ChatWindow] DND state change emitted to backend");
        } catch (e) {
          console.error("[ChatWindow] error emitting DND state change to backend", e);
        }
      }
    }
  }, [isDndSwitchOn, currentUserId, chat?.companyName, chat?.conversationId, chat?.roomId]);
  //#endregion

  //#region Debug: initial props/state
  // console.log("[ChatWindow] init", {
  //   chat,
  //   currentUserId,
  //   currentUserAvatar,
  //   isDndSwitchOn,
  //   dndError,
  //   companyName: chat?.companyName,
  //   conversationId: chat?.conversationId,
  //   isCompanyChat: chat && chat.companyName
  // });

  if (!chat || !chat.id) {
    return <div>{t("window.chatNotFound")}</div>;
  }
  //#endregion

  //#region Fetch messages when chat changes
  const fetchMessages = async () => {
    if (!chat.roomId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getMessages(chat.roomId, 1000000, 1, currentUserId);
      if (response.success) {
        // console.log("[ChatWindow] fetched messages (raw)", response.data.messages);

        // Transform API messages to match the expected format (simplified)
        const transformedMessages = response.data.messages.map((msg) => {
          const base = {
            from: msg.sender === currentUserId ? "user" : "other",
            text: msg.content,
            timestamp: msg.createdAt,
            _id: msg._id,
            receiver: msg.receiver,
            sender: msg.sender,
            seen: msg.seen,
          };

          if (msg?.file && typeof msg.file === "string") {
            if (isImagePath(msg.file)) {
              base.images = [getImg(msg.file)];
            } else {
              base.file = { name: msg.file.split("/").pop() || "file", url: getImg(msg.file) };
            }
          } else if (Array.isArray(msg.images) && msg.images.length) {
            base.images = msg.images.map((p) => (typeof p === "string" ? getImg(p) : p));
          }

          return base;
        });
        // console.log("[ChatWindow] transformed messages", transformedMessages);
        setMessages(transformedMessages);
      } else {
        setError("Failed to fetch messages");
      }
    } catch (err) {
      console.error("[ChatWindow] error fetching messages", err);
      setError(err.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [chat.roomId, currentUserId]);
  //#endregion

  //#region Fetch DND mode
  useEffect(() => {
    // Check DND mode for ALL chats (both company and user chats)
    if (currentUserId && chat?.conversationId) {
      //  // console.log("[ChatWindow] checking DND", {
      //     currentUserId,
      //     conversationId: chat.conversationId,
      //     isCompanyChat: chat && chat.companyName,
      //     chat: chat,
      //     companyName: chat?.companyName,
      //     timestamp: new Date().toISOString()
      //   });
      checkDnd(currentUserId, chat.conversationId);
    } else {
      // console.log("[ChatWindow] DND check skipped", {
      //   isDndSwitchOn,
      //   currentUserId,
      //   conversationId: chat?.conversationId,
      //   hasChat: !!chat,
      //   companyName: chat?.companyName,
      //   timestamp: new Date().toISOString()
      // });
    }
  }, [currentUserId, isDndSwitchOn, chat?.conversationId, checkDnd, chat]);
  //#endregion

  //#region Debug DND state
  // useEffect(() => {
  //   console.log("[ChatWindow] DND state changed:", {
  //     isDndSwitchOn,
  //     dndError,
  //     chat: chat?.companyName,
  //     conversationId: chat?.conversationId,
  //     currentUserId,
  //     timestamp: new Date().toISOString()
  //   });
  // }, [isDndSwitchOn, dndError, chat?.companyName, chat?.conversationId, currentUserId]);
  //#endregion

  //#region Socket: connect and subscribe to incoming messages for this room
  useEffect(() => {
    if (!currentUserId || !chat?.roomId) return;

    const socket = getChatSocket(currentUserId);
    let dndSyncInterval = null;

    try {
      // console.log("[ChatWindow] socket: connecting", { currentUserId, roomId: chat.roomId });
      socket.connect();
    } catch (e) {
      console.error("[ChatWindow] socket: connect error", e);
    }

    const onConnect = () => {
      try {
        // console.log("[ChatWindow] socket: connected, joining room", chat.roomId);
        socket.emit("join", { roomId: chat.roomId });
        // Emit open_chat event for first time chat open
        socket.emit("open_chat", chat.roomId);
        // console.log("[ChatWindow] socket: open_chat emitted", chat.roomId);
      } catch (e) {
        console.error("[ChatWindow] socket: join/open_chat error", e);
      }
    };

    const onMessage = (data = {}) => {
      // Accept messages that either match this room or, if roomId is absent,
      // match the current conversation participants. This avoids dropping
      // real-time events when backend doesn't include roomId in payload.
      const hasRoomId = typeof data.roomId !== "undefined" && data.roomId !== null;
      const otherParticipantId = chat?.conversationId;
      const senderId = data.senderId || data.sender;
      const receiverId = data.receiverId || data.receiver;

      if (hasRoomId && data.roomId !== chat.roomId) return;
      if (!hasRoomId && otherParticipantId) {
        const isForThisConversation =
          senderId === otherParticipantId || receiverId === otherParticipantId;
        if (!isForThisConversation) return;
      }

      // console.log("[ChatWindow] socket: message received", data);
      const content = data.text || data.content || data.message || "";

      const filePath = typeof data.file === "string" ? data.file : null;
      const isImage = filePath && isImagePath(filePath);
      const imageUrls = isImage ? [getImg(filePath)] : [];
      const fileObj =
        filePath && !isImage
          ? { name: filePath.split("/").pop() || "file", url: getImg(filePath) }
          : null;

      if (!content && imageUrls.length === 0 && !fileObj) return;

      setMessages((prev) => [
        ...prev,
        {
          from: senderId === currentUserId ? "user" : "other",
          text: content,
          timestamp: data.createdAt || new Date().toISOString(),
          sender: senderId,
          receiver: receiverId,
          ...(imageUrls.length ? { images: imageUrls } : {}),
          ...(fileObj ? { file: fileObj } : {}),
        },
      ]);
      // Notify parent to refresh sidebar list (last message preview, ordering, etc.)
      if (lastReceiverRef.current !== chat?.conversationId) {
        try {
          onActivity && onActivity();
        } catch {}
        lastReceiverRef.current = chat?.conversationId;
      }
    };

    // Handle DND updates from socket for this specific chat
    const onDndUpdate = (data = {}) => {
      // console.log("[ChatWindow] socket: dnd_update received", data);

      // Check if this DND update is for the current chat
      const { companyId, dndEnabled } = data;

      // If this is a company chat and the companyId matches, update DND state
      if (chat?.companyName && companyId === chat?.conversationId) {
        // console.log("[ChatWindow] updating DND state for company chat", { companyId, dndEnabled });
        useChatDndStore.getState().setSwitchOn(dndEnabled);
        // console.log(`[ChatWindow] DND is ${dndEnabled ? "ON" : "OFF"} for this chat`);
      }
      // If this is a user chat, we might need to check if the user is the one who updated DND
      // For now, we'll update if the current user is involved in the conversation
      else if (
        !chat?.companyName &&
        (companyId === currentUserId || companyId === chat?.conversationId)
      ) {
        // console.log("[ChatWindow] updating DND state for user chat", { companyId, dndEnabled });
        useChatDndStore.getState().setSwitchOn(dndEnabled);
        // console.log(`[ChatWindow] DND is ${dndEnabled ? "ON" : "OFF"} for this chat`);
      }

      if (dndEnabled === true) {
        // useChatDndStore.getState().setDndError("Messaging is disabled as you have enabled Do Not Disturb.");
        try {
          if (currentUserId && chat?.conversationId) {
            checkDnd(currentUserId, chat.conversationId);
          }
        } catch {}
      } else {
        useChatDndStore.getState().setDndError("");
      }
    };

    // Handle DND updates from backend (when other user changes DND state)
    const onBackendDndUpdate = (data = {}) => {
      // console.log("[ChatWindow] backend dnd_update received", data);

      const { companyId, dndEnabled } = data;

      // Update DND state based on the companyId or userId
      if (companyId) {
        // Check if this DND update affects the current chat
        if (chat?.companyName && companyId === chat?.conversationId) {
          // console.log("[ChatWindow] updating DND state from backend for company chat", { companyId, dndEnabled });
          useChatDndStore.getState().setSwitchOn(dndEnabled);
          // console.log(`[ChatWindow] DND is ${dndEnabled ? "ON" : "OFF"} for this chat`);
        } else if (
          !chat?.companyName &&
          (companyId === currentUserId || companyId === chat?.conversationId)
        ) {
          // console.log("[ChatWindow] updating DND state from backend for user chat", { companyId, dndEnabled });
          useChatDndStore.getState().setSwitchOn(dndEnabled);
          // console.log(`[ChatWindow] DND is ${dndEnabled ? "ON" : "OFF"} for this chat`);
        }
      }

      // When backend indicates DND is ON, verify via API for the current conversation
      if (dndEnabled === true) {
        try {
          if (currentUserId && chat?.conversationId) {
            checkDnd(currentUserId, chat.conversationId);
          }
        } catch {}
      }
    };

    // Handle DND state change acknowledgment from backend
    const onDndStateChangeAck = (data = {}) => {
      // console.log("[ChatWindow] DND state change acknowledged by backend", data);

      // Backend has confirmed the DND state change
      if (data.success) {
        // console.log("[ChatWindow] DND state change confirmed by backend");
      } else {
        console.error("[ChatWindow] DND state change failed on backend", data.error);
      }
    };

    // Request current DND state from backend when connecting
    const requestDndState = () => {
      try {
        // console.log("[ChatWindow] requesting current DND state from backend");
        socket.emit("request_dnd_state", {
          userId: currentUserId,
          companyId: chat?.companyName ? chat?.conversationId : currentUserId,
          conversationId: chat?.conversationId,
          roomId: chat?.roomId,
        });
      } catch (e) {
        console.error("[ChatWindow] error requesting DND state from backend", e);
      }
    };

    // Handle DND state response from backend
    const onDndStateResponse = (data = {}) => {
      // console.log("[ChatWindow] DND state response received from backend", data);

      if (data.dndEnabled !== undefined) {
        // console.log("[ChatWindow] updating DND state from backend response 00000000000000000", data.dndEnabled);
        useChatDndStore.getState().setSwitchOn(data.dndEnabled);
        // console.log(`[ChatWindow] DND is ${data.dndEnabled ? "ON" : "OFF"} for this chat`);
      }
    };

    // Periodic DND state sync with backend
    const startDndSync = () => {
      dndSyncInterval = setInterval(() => {
        if (socket.connected) {
          // console.log("[ChatWindow] periodic DND state sync with backend");
          requestDndState();
        }
      }, 30000); // Sync every 30 seconds
    };

    socket.on("connect", onConnect);
    // Listen to backend-aligned event
    socket.on("receive_message", onMessage);
    // Backward compatibility if server emits generic 'message'
    socket.on("message", onMessage);
    // Listen for DND updates
    socket.on("dnd_update", onDndUpdate);
    // Listen for DND updates from backend
    socket.on("dnd_update", onBackendDndUpdate);
    // Listen for DND state change acknowledgment
    socket.on("dnd_state_change_ack", onDndStateChangeAck);
    // Listen for DND state response from backend
    socket.on("dnd_state_response", onDndStateResponse);

    // If already connected (e.g., existing instance), join immediately
    if (socket.connected) {
      // console.log("[ChatWindow] socket already connected, joining room now", chat.roomId);
      onConnect();
      requestDndState(); // Request DND state when socket connects
      startDndSync(); // Start periodic sync
    }

    return () => {
      try {
        // console.log("[ChatWindow] socket: cleanup, leaving room", chat.roomId);
        socket.emit("leave", { roomId: chat.roomId });
      } catch (e) {
        console.error("[ChatWindow] socket: leave error", e);
      }
      socket.off("connect", onConnect);
      socket.off("receive_message", onMessage);
      socket.off("message", onMessage);
      socket.off("dnd_update", onDndUpdate);
      socket.off("dnd_update", onBackendDndUpdate);
      socket.off("dnd_state_change_ack", onDndStateChangeAck);
      socket.off("dnd_state_response", onDndStateResponse);

      // Clear DND sync interval
      if (dndSyncInterval) {
        clearInterval(dndSyncInterval);
      }

      try {
        // console.log("[ChatWindow] socket: disconnecting");
        socket.disconnect();
      } catch (e) {
        console.error("[ChatWindow] socket: disconnect error", e);
      }
    };
  }, [currentUserId, chat?.roomId]);
  //#endregion

  //#region set scrollbehavior
  const scrollToBottom = (behavior = "smooth") => {
    const container = messagesContainerRef.current;
    if (!container) return;
    try {
      container.scrollTo({ top: container.scrollHeight, behavior });
    } catch (e) {
      container.scrollTop = container.scrollHeight;
    }
  };
  //#endregion

  //#region Reset initial scroll flag when switching chats
  useEffect(() => {
    hasInitialScrolledRef.current = false;
  }, [chat?.roomId]);
  //#endregion

  //#region On first load of messages for a chat, jump to bottom instantly.
  // Afterwards, always auto-scroll to bottom for new messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;

    if (!hasInitialScrolledRef.current) {
      scrollToBottom("auto");
      hasInitialScrolledRef.current = true;
      return;
    }

    // Always scroll to bottom for new messages
    scrollToBottom("smooth");
  }, [messages]);

  //#endregion

  //#region handle send message
  const handleSend = async () => {
    const contentToSend = newMessage;
    const hasText = contentToSend.replace(/\s+/g, "").length > 0;
    const hasImages = pendingImages.length > 0;
    const hasDoc = Boolean(pendingDoc);
    const hasAnyAttachment = hasImages || hasDoc;
    if (!hasText && !hasAnyAttachment) return;

    const timestamp = new Date().toISOString();

    // Combine attachments with a shared limit of 2
    const MAX_ATTACHMENTS = 2;
    const remainingForImages = MAX_ATTACHMENTS - (hasDoc ? 1 : 0);
    const selectedImagePreviews =
      remainingForImages > 0 ? pendingImagePreviews.slice(0, remainingForImages) : [];
    const includeDoc = hasDoc && selectedImagePreviews.length < MAX_ATTACHMENTS;

    const messageObj = {
      from: "user",
      text: contentToSend,
      timestamp,
      ...(selectedImagePreviews.length ? { images: selectedImagePreviews } : {}),
      ...(includeDoc ? { file: { name: pendingDoc?.name, type: pendingDoc?.type } } : {}),
    };

    // Optimistically add the message to the UI
    setMessages((prev) => [...prev, messageObj]);
    setNewMessage("");
    if (hasAnyAttachment) {
      setPendingImages([]);
      setPendingImagePreviews([]);
      setPendingDoc(null);
    }
    // console.log("[ChatWindow] sending message", {
    //   content: contentToSend,
    //   roomId: chat.roomId,
    //   receiverId: chat?.conversationId,
    // });

    try {
      const MAX_ATTACHMENTS = 2;
      const imagesSlice = pendingImages.slice(0, Math.max(0, MAX_ATTACHMENTS - (hasDoc ? 1 : 0)));
      const docSlice = hasDoc && imagesSlice.length < MAX_ATTACHMENTS ? [pendingDoc] : [];
      const chatFiles = [...imagesSlice, ...docSlice];

      const response = await sendMessage({
        senderId: currentUserId,
        receiverId: chat?.conversationId, // Update this if your chat object uses a different field for receiver
        content: hasText ? contentToSend : "",
        chatFiles,
      });

      // console.log("[ChatWindow] message sent via API", response);

      //  If API returns the saved message with full file URL, update the last optimistic message
      // if (response?.success && response.data) {
      //   setMessages((prev) => {
      //     const updated = [...prev];
      //     updated[updated.length - 1] = {
      //       ...updated[updated.length - 1],
      //       ...response.data, // merge API response (should include file.url, _id, etc.)
      //     };
      //     return updated;
      //   });
      // }

      // Notify parent to refresh sidebar after a successful send
      if (lastReceiverRef.current !== chat?.conversationId) {
        try {
          onActivity && onActivity();
        } catch {}
        lastReceiverRef.current = chat?.conversationId;
      }
      // Emit real-time event (ensure socket is connected)
      try {
        const socket = getChatSocket(currentUserId);
        // console.log(socket, "socketsocketsocketsocketsocketsocketsocketsocketsocket");

        const payload = {
          roomId: chat.roomId,
          senderId: currentUserId,
          content: contentToSend,
          receiverId: chat?.conversationId,
        };
        if (socket?.connected) {
          // socket.emit("send_message", payload);
          // console.log("[ChatWindow] socket: emitted send_message (connected)", payload);
        } else if (socket) {
          socket.once("connect", () => {
            try {
              // socket.emit("send_message", payload);
              // console.log("[ChatWindow] socket: emitted send_message after connect", payload);
            } catch (e) {
              console.error("[ChatWindow] socket: emit after connect error", e);
            }
          });
          try {
            socket.connect();
          } catch (e) {
            console.error("[ChatWindow] socket: connect on send error", e);
          }
        }
      } catch (e) {
        console.error("[ChatWindow] socket: emit error", e);
      }
    } catch (error) {
      console.error("[ChatWindow] error sending message", error);
      setError("Failed to send message");
    }
  };
  //#endregion

  //#region handle key down for send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // console.log("[ChatWindow] Enter key pressed -> send");
      handleSend();
    }
  };
  //#endregion

  //#region Auto rsize text area
  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [newMessage]);
  //#endregion

  //#region handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // ❌ More than one file selected
    if (files.length > 1) {
      toast.error("Please upload only one image at a time.");
      return;
    }

    const file = files[0];

    // Combined limit across images + doc is 2
    const currentCount = pendingImages.length + (pendingDoc ? 1 : 0);
    const availableSlots = Math.max(0, 2 - currentCount);
    if (availableSlots <= 0) return;

    // validate file
    if (!file.type?.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t(`sizeError`));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingImages((prev) => [...prev, file]);
      setPendingImagePreviews((prev) => [...prev, reader.result]);
    };
    reader.readAsDataURL(file);
  };
  //#endregion

  //#region handle document Upload
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(r("fileSizeError"));
      e.target.value = "";
      return;
    }
    // Combined limit across images + doc is 2
    const currentCount = pendingImages.length + (pendingDoc ? 1 : 0);
    const availableSlots = Math.max(0, 2 - currentCount);
    if (availableSlots <= 0) return;

    setPendingDoc(file);
    // console.log("[ChatWindow] document selected", {
    //   name: file.name,
    //   type: file.type,
    //   size: file.size,
    // });
  };
  //#endregion

  //#region Preserve user's exact input (including Shift+Enter newlines and spaces)
  const renderRawText = (text) => text;
  //#endregion

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-50">
      <ChatWindowHeader chat={chat} onBack={onBack} dndSwitchOn={isDndSwitchOn} />

      <div
        ref={messagesContainerRef}
        className="no-scrollbar max-h-[50vh] space-y-6 overflow-x-hidden overflow-y-auto bg-[#D9D9D9]/[10%] p-4"
      >
        {loading ? (
          <div className="flex flex-col gap-6 py-2">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 max-w-[80%]">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex justify-center py-8">
            {/* <div className="text-red-500">
              {t("window.error")}: {error}
              <button
                className="ml-2 text-blue-500 underline"
                onClick={() => window.location.reload()}
              >
                {t("window.retry")}
              </button>
            </div> */}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">{t("window.empty")}</div>
          </div>
        ) : (
          (() => {
            let lastDate = null;
            return messages.map((msg, idx) => {
              //// console.log(msg, "sdfsdkfhjksdhfksdfklsd;;;;;;;;;;");

              const msgDate = msg.timestamp ? new Date(msg.timestamp) : new Date();
              if (isNaN(msgDate.getTime())) return null;

              const showDate = !lastDate || !isSameDay(new Date(lastDate), msgDate);
              lastDate = msgDate;

              return (
                <div key={idx} className="group relative space-y-1">
                  {showDate && (
                    <div className="sticky top-0 z-10 my-4 flex justify-center">
                      <span className="rounded-md bg-white px-4 py-1 text-xs text-gray-500 shadow">
                        {format(msgDate, "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex items-start justify-between space-x-3 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`flex items-center gap-3 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <ImageFallback
                          src={
                            msg.from === "user"
                              ? user?.logoUrl
                                ? getImg(user.logoUrl)
                                : getImg(user.profile.photo)
                              : chat?.avatar
                                ? getImg(chat?.avatar)
                                : "/no-img.png"
                          }
                          alt="avatar"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="text-sm font-medium text-black">
                          {msg.from === "user" ? t("window.you") : chat.name}
                        </div>
                      </div>
                      <div
                        className={`mt-1 max-w-md py-3 text-left ${msg.from === "user" ? "" : ""}`}
                      >
                        {msg.text && (
                          <div
                            className={`inline-block rounded-lg px-3 py-2 text-sm break-words break-all whitespace-pre-wrap text-gray-700 ${msg.from === "user" ? "bg-green-100" : "bg-white"}`}
                          >
                            {renderRawText(msg.text)}
                          </div>
                        )}
                        {Array.isArray(msg.images) && msg.images.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.images.map((imgSrc, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={imgSrc}
                                alt={`sent-${imgIdx}`}
                                className="max-w-xs cursor-pointer rounded-md border border-slate-200"
                                onClick={() => setSelectedImage(imgSrc)}
                              />
                            ))}
                          </div>
                        )}
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="sent"
                            className="mt-2 max-w-xs cursor-pointer rounded-md border border-slate-200"
                            onClick={() => setSelectedImage(msg.image)}
                          />
                        )}
                        {msg.file && (
                          <div className="mt-2 flex max-w-xs items-center gap-2 rounded-md border bg-white p-2 text-sm">
                            {/* {console.log(msg.file, "fileeee")} */}
                            <span className="font-medium">{msg.file.name}</span>
                            {msg.file.url ? (
                              <a
                                href={msg.file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 underline"
                              >
                                {t("window.open")}
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">{t("window.open")}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <span className="mt-2 text-xs text-gray-400">
                        {format(msgDate, "hh:mm a")}
                      </span> */}
                      {/* <div className="relative">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setMessageOptionsIdx(messageOptionsIdx === idx ? null : idx)
                          }
                        >
                          <BsThreeDotsVertical />
                        </button>
                        {messageOptionsIdx === idx && (
                          <div className="absolute right-0 z-10 mt-2 w-32 rounded border bg-white shadow">
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteMessage(idx)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2 bg-[#D9D9D9]/[10%]">
        {(() => {
          const shouldShowDnd =
            isDndSwitchOn === true || isDndSwitchOn === null || isDndSwitchOn === "" || dndError;

          if (shouldShowDnd) {
            return (
              <div className="flex items-center justify-center px-4 py-6">
                <div className="text-center">
                  <div className="mb-1 flex text-sm font-medium text-red-700">
                    <MdErrorOutline className="mx-2 text-xl" /> {dndError}
                  </div>
                </div>
              </div>
            );
          }

          if (!isConnected) {
            return (
              <div className="flex items-center justify-center px-4 py-6">
                <div className="text-center text-sm text-gray-500">
                  {t("notConnectedMessage")} <br />
                  {t("addToConnectionToSend")}
                </div>
              </div>
            );
          }

          // ✅ Normal chat input + pending uploads
          return (
            <>
              {(pendingImages.length > 0 || pendingDoc) && (
                <div className="px-4 pt-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {pendingImages.map((imgFile, index) => (
                      <div key={index} className="relative inline-block max-w-[160px]">
                        <img
                          src={pendingImagePreviews[index] || ""}
                          alt={`preview-${index}`}
                          className="w-full rounded-md border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPendingImages((prev) => prev.filter((_, i) => i !== index));
                            setPendingImagePreviews((prev) => prev.filter((_, i) => i !== index));

                            // also clear input value so same file can be chosen again
                            document.getElementById("image-input").value = "";
                          }}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 px-2 py-0.5 text-[11px] text-white"
                        >
                          {t("window.remove")}
                        </button>
                      </div>
                    ))}

                    {pendingDoc && (
                      <div className="relative inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                        <span
                          className="max-w-[220px] truncate font-medium"
                          title={pendingDoc.name}
                        >
                          {pendingDoc.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPendingDoc(null);
                            document.getElementById("doc-input").value = "";
                          }}
                          className="rounded bg-red-500 px-2 py-0.5 text-[11px] text-white"
                        >
                          {t("window.remove")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-2 border-y border-black/10 px-4 py-4">
                <textarea
                  ref={textareaRef}
                  placeholder={t("window.inputPlaceholder")}
                  className="flex-1 resize-none bg-[#D9D9D9]/[10%] px-2 pb-2 text-[13px] font-normal outline-none"
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="rounded-[2px] bg-[#0F8200] px-4 py-1 text-[13px] font-normal text-white hover:bg-green-700"
                >
                  {t("window.send")}
                </button>
              </div>

              <div className="flex items-center justify-between px-4 py-2 pb-3">
                <div className="flex gap-1">
                  <div
                    className="cursor-pointer rounded-sm border border-transparent bg-[#CFE6CC] px-2 py-2 hover:border-[#0F8200] hover:bg-transparent"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <RiGalleryLine className="text-primary" />
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <div
                    className="cursor-pointer rounded-sm border border-transparent bg-[#CFE6CC] px-2 py-2 hover:border-[#0F8200] hover:bg-transparent"
                    onClick={() => docInputRef.current.click()}
                  >
                    <FiLink className="text-primary" />
                    <input
                      id="doc-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.mp4,.mp3"
                      ref={docInputRef}
                      onChange={handleDocUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="cursor-pointer rounded-sm border border-transparent bg-[#CFE6CC] px-2 py-2 hover:border-[#0F8200] hover:bg-transparent">
                    <FaCamera className="text-primary" />
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {selectedImage && (
        <div
          className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
