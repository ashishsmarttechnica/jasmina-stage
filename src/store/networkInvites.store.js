import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useNetworkInvitesStore = create(
  devtools(
    (set) => ({
      data: [],
      loading: true,
      error: null,
      setData: (data) => set({ data }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      // Reset store
      resetStore: () =>
        set({
          data: [],
          loading: true,
          error: null,
        }),
    }),
    { name: "networkInvitesStore" }
  )
);

export default useNetworkInvitesStore;
