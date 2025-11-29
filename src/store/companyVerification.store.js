import { create } from "zustand";

const useCompanyVerificationStore = create((set, get) => ({
    // State
    isVerified: false,
    isLoading: false,
    error: null,
    message: "",
    lastChecked: null,
    statusCode: null,

    // Actions
    setVerified: (verified) => set({ isVerified: verified }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setMessage: (message) => set({ message }),
    setLastChecked: (timestamp) => set({ lastChecked: timestamp }),
    setStatusCode: (code) => set({ statusCode: code }),

    // Reset function
    reset: () => set({
        isVerified: false,
        isLoading: false,
        error: null,
        message: "",
        lastChecked: null,
        statusCode: null,
    }),

    // Check verification status
    checkVerification: async (companyId) => {
        if (!companyId) {
            set({ error: "No company ID provided", isVerified: false });
            return { success: false, message: "No company ID provided" };
        }

        set({ isLoading: true, error: null });

        try {
            // Get token from cookies
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            // Add authorization header if token exists
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/isVerified?companyId=${companyId}`,
                {
                    cache: "no-store",
                    headers
                }
            );

            // Always try to parse the response first, regardless of status code
            let data;
            try {
                data = await response.json();
            } catch (e) {
                // If we can't parse JSON, treat as error
                const errorMessage = `API Error: ${response.status}`;
                set({
                    isLoading: false,
                    error: errorMessage,
                    isVerified: false,
                    message: "Unable to parse API response"
                });
                return { success: false, message: "Unable to parse API response" };
            }

            // Check if response is successful (200-299) OR if we have valid data
            if (response.ok || (data && typeof data.success !== 'undefined')) {
                // Valid response - use the data
                set({
                    isLoading: false,
                    error: null,
                    isVerified: data.success || false,
                    message: data.message || "",
                    lastChecked: Date.now(),
                    statusCode: response.status
                });
                return { ...data, statusCode: response.status };
            } else {
                // Invalid response
                const errorMessage = `API Error: ${response.status}`;
                set({
                    isLoading: false,
                    error: errorMessage,
                    isVerified: false,
                    message: data.message || "API request failed",
                    statusCode: response.status
                });
                return { success: false, message: data.message || "API request failed", statusCode: response.status };
            }
        } catch (error) {
            const errorMessage = error.message || "Network error";
            set({
                isLoading: false,
                error: errorMessage,
                isVerified: false,
                message: "Unable to verify company status"
            });
            return { success: false, message: "Unable to verify company status" };
        }
    },
}));

export default useCompanyVerificationStore;
