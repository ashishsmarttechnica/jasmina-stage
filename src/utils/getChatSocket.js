// utils/getChatSocket.js
import { io } from "socket.io-client";

// Resolve Socket.IO base URL with sensible fallbacks
function resolveSocketBaseUrl() {
    const envBase = process.env.NEXT_PUBLIC_SOCKET_BASE || process.env.NEXT_PUBLIC_SOCKET_URL;
    if (envBase && typeof envBase === "string") return envBase;
    if (typeof window !== "undefined" && window.location) {
        // Use same origin by default when env is not provided
        return window.location.origin;
    }
    // Final fallback to previous local IP (adjust if needed)
    return "http://192.168.1.36:9696";
}

const socketPath = process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io";

// Cache sockets per user so multiple components reuse the same instance
const sockets = {};

export function getChatSocket(userId) {
    if (!userId) {
        console.error("[socket] User ID missing for socket connection");
        return null;
    }

    // Reuse existing socket for this user if present
    if (sockets[userId]) {
        return sockets[userId];
    }

    const baseURL = resolveSocketBaseUrl();

    // Create new socket instance using per-user namespace: /user-{userId}
    const socket = io(`${baseURL}/user-${userId}`, {
        path: socketPath,
        transports: ["websocket", "polling"],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
    });

    // Helpful diagnostics
    try {
        socket.on("connect_error", (err) => {
            console.warn("[socket] connect_error:", err?.message || err);
        });
        socket.on("error", (err) => {
            console.warn("[socket] error:", err?.message || err);
        });
    } catch (_) {
        // noop
    }

    sockets[userId] = socket;
    return socket;
}

