import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useSingleCompanyAppliedJobStore = create(
  devtools(
    persist(
      (set) => ({
        appliedJobs: [],
        selectedJob: null,
        pagination: null,

        setAppliedJobs: (appliedJobs) => set({ appliedJobs }),
        setSelectedJob: (selectedJob) => set({ selectedJob }),
        setPagination: (pagination) => set({ pagination }),
      }),
      {
        name: "single-company-applied-job-storage",
        partialize: (state) => ({
          selectedJob: state.selectedJob,
          appliedJobs: state.appliedJobs,
          pagination: state.pagination,
        }),
      }
    )
  )
);

export default useSingleCompanyAppliedJobStore;
