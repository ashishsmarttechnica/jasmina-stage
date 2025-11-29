import { getAppliedJobs } from "@/api/job.api";
import { create } from "zustand";

const useAppliedJobStore = create((set) => ({
  appliedJobs: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    total: 0,
  },

  setAppliedJobs: (appliedJobs) => set({ appliedJobs }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),

  getAppliedJobs: async ({ userId, page = 1, limit = 10, onSuccess, onError }) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getAppliedJobs({ userId, page, limit });

      if (response.success && response.data) {
        // Extract jobs from appliedJobs array
        const appliedJobsData = response.data.appliedJobs || [];


        set({
          appliedJobs: appliedJobsData,
          isLoading: false,
          pagination: {
            currentPage: response.data.currentPage || 1,
            totalPages: response.data.totalPages || 1,
            pageSize: response.data.pageSize || 10,
            total: response.data.total || 0,
          },
        });
      } else {
        set({
          appliedJobs: [],
          isLoading: false,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            pageSize: 10,
            total: 0,
          },
        });
      }

      if (onSuccess) onSuccess(response);
    } catch (error) {
      set({ error, isLoading: false });
      if (onError) onError(error);
    }
  },

  clearAppliedJobs: () =>
    set({
      appliedJobs: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        total: 0,
      },
    }),
}));

export default useAppliedJobStore;
