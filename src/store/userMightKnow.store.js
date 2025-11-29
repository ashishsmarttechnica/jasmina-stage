import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useUserMightKnowStore = create(
  devtools(
    (set) => ({
      suggestions: [],
      loading: true,
      error: null,

      setSuggestions: (suggestions) => set({ suggestions }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Reset store
      resetStore: () =>
        set({
          suggestions: [],
          loading: true,
          error: null,
        }),
    }),
    { name: "UserMightKnowStore" }
  )
);

export default useUserMightKnowStore;

export const useCompanySuggestionsStore = create(
  devtools(
    (set) => ({
      suggestions: [],
      loading: true,
      error: null,

      setSuggestions: (suggestions) => set({ suggestions }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      resetStore: () =>
        set({
          suggestions: [],
          loading: true,
          error: null,
        }),
    }),
    { name: "CompanySuggestionsStore" }
  )
);
