
// utils/getChatSocket.js
import { io } from "socket.io-client";

const baseURL = process.env.NEXT_PUBLIC_SOCKET_BASE || process.env.NEXT_PUBLIC_SOCKET_URL;


let chatSockets = {};
let notificationSockets = {};
let openChatSockets = {};
let closeChatSockets = {};

export function getChatSocket(userId) {
    if (!userId) {
        console.error("User ID missing for socket connection");
        return null;
    }

    // Reuse existing socket if present
    if (chatSockets[userId]) {
        return chatSockets[userId];
    }

    // Naya socket instance banao
    const socket = io(`${baseURL}/user-${userId}`, {
        transports: ["websocket"],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
    });

    chatSockets[userId] = socket;

    return socket;
}


export function getnotificationSocket(userId) {
    if (!userId) {
        console.error("User ID missing for socket connection");
        return null;
    }
    // Reuse existing notification socket if present
    if (notificationSockets[userId]) {
        return notificationSockets[userId];
    }
    // Naya socket instance banao
    const socket = io(`${baseURL}/user-${userId}`, {
        transports: ["websocket"],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
    });
    notificationSockets[userId] = socket;
    return socket;
}

export function openchatSocket(roomId) {
    if(!roomId) {
        console.error("Room ID missing for socket connection");
        return null;
    }
    if( openChatSockets[roomId]) {
        return openChatSockets[roomId];
    }
    const socket = io(`${baseURL}/open_chat-${roomId}`, {
        transports: ["websocket"],
        autoConnect: false,     
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,    
    });
    openChatSockets[roomId] = socket;
    return socket;
}

export function closeChatSocket(roomId) {
    if(!roomId) {
        console.error("Room ID missing for socket connection");
        return null;
    }
    if( closeChatSockets[roomId]) {
        return closeChatSockets[roomId];
    }
    const socket = io(`${baseURL}/close_chat-${roomId}`, {
        transports: ["websocket"],
        autoConnect: false,     
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,    
    });
    closeChatSockets[roomId] = socket;
    return socket;
}