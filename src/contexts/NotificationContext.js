"use client";

import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotificationContext must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [counts, setCounts] = useState({ chatCount: 0, notificationCount: 0 });

    const updateCounts = (newCounts) => {
        setCounts(newCounts);
    };

    return (
        <NotificationContext.Provider value={{ counts, updateCounts }}>
            {children}
        </NotificationContext.Provider>
    );
};
