"use client";
import { create } from "zustand";

const useReviewStore = create((set) => ({
    isReviewModalOpen: false,
    openReviewModal: () => set({ isReviewModalOpen: true }),
    closeReviewModal: () => set({ isReviewModalOpen: false }),
}));

export default useReviewStore;
