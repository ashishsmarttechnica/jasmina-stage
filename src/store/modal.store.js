"use client";
import { create } from "zustand";

const useModalStore = create((set) => ({
    isBlockedModalOpen: false,
    openBlockedModal: () => set({ isBlockedModalOpen: true }),
    closeBlockedModal: () => set({ isBlockedModalOpen: false }),

    // New modal for user blocked (status 507)
    isUserBlockedModalOpen: false,
    openUserBlockedModal: () => set({ isUserBlockedModalOpen: true }),
    closeUserBlockedModal: () => set({ isUserBlockedModalOpen: false }),
}));

export default useModalStore;
