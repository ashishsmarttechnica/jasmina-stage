import { create } from "zustand";

const useNewJobPostStore = create((set) => ({
  message: "",
  isLoading: false,
  isverified: false,
  setMessage: (message) => set({ message }),
  setLoading: (loading) => set({ isLoading: loading }),
  setIsverified: (isverified) => set({ isverified }),
}));

export default useNewJobPostStore;
