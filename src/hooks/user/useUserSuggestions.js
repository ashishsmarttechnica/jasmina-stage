import { getCompanySuggestions, getUserSuggestions } from "@/api/user.api";
import useUserMightKnowStore, { useCompanySuggestionsStore } from "@/store/userMightKnow.store";
import { useQuery } from "@tanstack/react-query";

export const useUserSuggestions = (page = 1, limit = 10000) => {
  const { suggestions, setSuggestions } = useUserMightKnowStore();

  return useQuery({
    queryKey: ["userSuggestions", page],
    queryFn: async () => {
      try {
        const params = { page, limit };
        const response = await getUserSuggestions(params);
        if (response?.success) {
          // Merge new suggestions with existing ones if not first page
          const newSuggestions =
            page === 1
              ? response.data
              : {
                  ...response.data,
                  results: [...(suggestions?.results || []), ...response.data.results],
                };
          setSuggestions(newSuggestions);
          return newSuggestions;
        }
        throw new Error(response?.message || "Failed to fetch suggestions");
      } catch (error) {
        console.error("Error fetching user suggestions:", error);
        throw error;
      }
    },
    enabled: !suggestions?.results?.length || page > 1,
    refetchOnWindowFocus: false,
    retry: 1,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 10 * 60 * 1000,
  });
};
export const useCompanySuggestions = (page = 1, limit = 10000) => {
  const { suggestions, setSuggestions } = useCompanySuggestionsStore();

  return useQuery({
    queryKey: ["CompanySuggestionsStore", page],
    queryFn: async () => {
      try {
        const params = { page, limit };
        const response = await getCompanySuggestions(params);
        if (response?.success) {
          // Merge new suggestions with existing ones if not first page
          const newSuggestions =
            page === 1
              ? response.data
              : {
                  ...response.data,
                  results: [...(suggestions?.results || []), ...response.data.results],
                };
          setSuggestions(newSuggestions);
          return newSuggestions;
        }
        throw new Error(response?.message || "Failed to fetch suggestions");
      } catch (error) {
        console.error("Error fetching user suggestions:", error);
        throw error;
      }
    },
    enabled: !suggestions?.results?.length || page > 1,
    refetchOnWindowFocus: false,
    retry: 1,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 10 * 60 * 1000,
  });
};
