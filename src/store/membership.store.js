import { getAllMemberships, getPreviousPlans, purchasePlan } from "@/api/membership.api";
import { create } from "zustand";

const useMembershipStore = create((set) => ({
  memberships: [],
  previousPlans: [],
  isLoading: false,
  error: null,




  getMemberships: async (companyId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getAllMemberships(companyId);
      set({ memberships: response.data, isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Get previous plans
  getPreviousPlans: async (companyId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getPreviousPlans(companyId);
      set({ previousPlans: response.data, isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Purchase plan
  purchasePlan: async (purchaseData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await purchasePlan(purchaseData);
      // Optionally update the memberships or previous plans after purchase
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Reset store
  resetStore: () => {
    set({
      memberships: [],
      previousPlans: [],
      isLoading: false,
      error: null,
    });
  },
}));

export default useMembershipStore;
