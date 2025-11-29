import axios from "@/lib/axios";

export const getSearchSuggestions = async ({ query, limit = 10, page = 1, userId, filter, signal }) => {
  try {
    let url = `/search?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`;
    if (userId) {
      url += `&userId=${encodeURIComponent(userId)}`;
    }
    if (filter && filter !== "all") {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    const response = await axios.get(url, { signal });
    return response.data;
  } catch (error) {
    // Don't throw if request was aborted
    if (error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      throw { name: 'AbortError', message: 'Request aborted' };
    }
    
    // Handle 403/404 as "no results" instead of error
    // This prevents red errors in network tab when search finds nothing
    const status = error?.response?.status;
    if (status === 403 || status === 404) {
      // Return empty results instead of throwing error
      return {
        success: true,
        data: {
          users: [],
          companies: [],
          jobs: []
        }
      };
    }
    
    throw error;
  }
};
