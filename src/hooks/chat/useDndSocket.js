import useChatDndStore from "@/store/chatDnd.store";
import { getChatSocket } from "@/utils/socket";
import Cookies from "js-cookie";
import { useEffect } from "react";

/**
 * Custom hook to handle DND (Do Not Disturb) socket updates
 * 
 * This hook listens for 'dnd_update' events from the socket server and updates
 * the global DND state accordingly. The backend emits these events when a user
 * or company updates their DND settings.
 * 
 * Backend event format:
 * {
 *   companyId: string,    // ID of the company/user who updated DND
 *   dndEnabled: boolean   // Whether DND is enabled (true) or disabled (false)
 * }
 * 
 * Usage:
 * - Automatically initialized in AppInit.js for global DND state management
 * - Can be used in individual components for specific DND handling
 */

export const useDndSocket = () => {
    const setSwitchOn = useChatDndStore((state) => state.setSwitchOn);

    useEffect(() => {
        const token = Cookies.get("token");
        const userId = Cookies.get("userId");

        if (!token || !userId) return;

        const socket = getChatSocket(userId);
        if (!socket) return;

        // Connect to socket if not already connected
        if (!socket.connected) {
            try {
                socket.connect();
            } catch (e) {
                console.error("[useDndSocket] socket: connect error", e);
            }
        }

        // Handle DND updates from socket
        const onDndUpdate = (data = {}) => {
           // console.log("[useDndSocket] dnd_update received", data);

            const { companyId, dndEnabled } = data;

            // Update DND state globally
            if (companyId && typeof dndEnabled === "boolean") {
               // console.log("[useDndSocket] updating DND state", { companyId, dndEnabled });
                setSwitchOn(dndEnabled);
            } else {
                console.warn("[useDndSocket] invalid dnd_update data", { companyId, dndEnabled });
            }
        };

        // Add error handling for socket events
        const onConnectError = (error) => {
            console.error("[useDndSocket] socket connect error:", error);
        };

        const onError = (error) => {
            console.error("[useDndSocket] socket error:", error);
        };

        socket.on("dnd_update", onDndUpdate);
        socket.on("connect_error", onConnectError);
        socket.on("error", onError);

        return () => {
            socket.off("dnd_update", onDndUpdate);
            socket.off("connect_error", onConnectError);
            socket.off("error", onError);
        };
    }, [setSwitchOn]);
};

export default useDndSocket;
