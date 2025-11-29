import { create } from "zustand";

const useResentJobStore = create((set) => ({
  resentJobs: [],
  isLoading: false,
  error: null,
  setResentJobs: (jobs) => set({ resentJobs: jobs }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

export default useResentJobStore;
