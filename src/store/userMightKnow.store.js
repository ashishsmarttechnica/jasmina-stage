import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  suggestions: { results: [] },
  loading: true,
  error: null,
};

const buildStore = (name) =>
  create(
    devtools(
      (set) => ({
        ...initialState,
        setSuggestions: (suggestions) => set({ suggestions }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        removeSuggestion: (id) =>
          set((state) => {
            const current = state.suggestions;

            if (!current?.results) {
              return { suggestions: current };
            }

            return {
              suggestions: {
                ...current,
                results: current.results.filter((item) => item._id !== id),
              },
            };
          }),
        resetStore: () => set(initialState),
      }),
      { name }
    )
  );

const useUserMightKnowStore = buildStore("UserMightKnowStore");

export default useUserMightKnowStore;

export const useCompanySuggestionsStore = buildStore("CompanySuggestionsStore");
