import {
    getSavedJob as getSavedJobApi,
    getSavedJobs as getSavedJobsApi,
    saveJob as saveJobApi,
} from "@/api/job.api";
import { create } from "zustand";

const useJobStore = create((set, get) => ({
  jobs: [],
  savedJobs: [],
  selectedJob: null, // ✅ added
  isLoading: false,
  error: null,
  pagination: {},
  setJobs: (jobs) => set({ jobs }),
  appendJobs: (newJobs) => set((state) => ({ jobs: [...state.jobs, ...newJobs] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  clearJobs: () => set({ jobs: [], pagination: {} }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  getSavedJobs: async ({ userId, onSuccess, onError }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getSavedJobsApi(userId);

      // Extract jobs from savedJobs array
      if (response.data && response.data.savedJobs) {
        const savedJobs = response.data.savedJobs.map((item) => ({
          ...item.jobId,
          savedId: item._id,
          savedAt: item.createdAt,
        }));
        set({ jobs: savedJobs, savedJobs: savedJobs, isLoading: false });
      } else {
        set({ jobs: [], savedJobs: [], isLoading: false });
      }

      if (onSuccess) onSuccess(response);
    } catch (error) {
      set({ error, isLoading: false });
      if (onError) onError(error);
    }
  },
  getSavedJob: async ({ id, onSuccess, onError }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getSavedJobApi(id);

      // Process the saved job data
      if (response.data && response.data.savedJobs && response.data.savedJobs.length > 0) {
        const savedJob = response.data.savedJobs[0];
        const jobData = {
          ...savedJob.jobId,
          savedId: savedJob._id,
          savedAt: savedJob.createdAt,
        };
        set({ jobs: [jobData], isLoading: false });

        // Update savedJobs array too
        const currentSavedJobs = get().savedJobs;
        const jobExists = currentSavedJobs.some((job) => job._id === jobData._id);
        if (!jobExists) {
          set({ savedJobs: [...currentSavedJobs, jobData] });
        }
      } else {
        set({ jobs: [], isLoading: false });
      }

      if (onSuccess) onSuccess(response);
    } catch (error) {
      set({ error, isLoading: false });
      if (onError) onError(error);
    }
  },
  saveJob: async ({ jobId, userId, onSuccess, onError }) => {
    try {
      const res = await saveJobApi({ jobId, userId });

      // Update savedJobs array to mark job as saved/bookmarked
      const currentJobs = get().jobs;
      const currentSavedJobs = get().savedJobs;

      const savedJob = currentJobs.find((job) => job._id === jobId);
      if (savedJob && !currentSavedJobs.some((job) => job._id === jobId)) {
        const newSavedJob = {
          ...savedJob,
          savedId: res.data?.savedJob?._id || `temp_${jobId}`,
          savedAt: new Date().toISOString(),
        };
        set({ savedJobs: [...currentSavedJobs, newSavedJob] });
      }

      if (onSuccess) onSuccess(res);
    } catch (error) {
      if (onError) onError(error);
    }
  },
}));

export default useJobStore;
