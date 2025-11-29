import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useSingleApplicationApplicantStore = create(
  devtools((set) => ({
    applicants: [],
    selectedApplicant: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      total: 0,
    },

    setApplicants: (applicants) => set({ applicants }),
    setSelectedApplicant: (selectedApplicant) => set({ selectedApplicant }),
    setPagination: (pagination) => set({ pagination }),

    // Add an applicant to the list
    addApplicant: (applicant) =>
      set((state) => ({
        applicants: [applicant, ...state.applicants],
      })),

    // Clear all applicants
    clearApplicants: () =>
      set({
        applicants: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          pageSize: 10,
          total: 0,
        },
      }),
  }))
);

export default useSingleApplicationApplicantStore;
