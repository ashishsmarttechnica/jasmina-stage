import { checkDndMode } from "@/api/chat.api";
import { getCompany, updateCompanyDndMode } from "@/api/company.api";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useChatDndStore = create(
    devtools(
        persist(
            (set, get) => ({
                switchOn: null,
                loading: false,
                error: null,
                setSwitchOn: (value) => set({ switchOn: value }),
                setDndError: (message) => set({ error: message }),

                // Initialize DND state - this prevents the flicker
                initializeDnd: () => {
                    const state = get();
                    if (state.switchOn === null) {
                        // Set loading state until we get the real value
                        set({ loading: true });
                    }
                },

                // Reset loading state when we have a valid DND state
                resetLoading: () => {
                    const state = get();
                    if (state.switchOn !== null && state.loading) {
                        set({ loading: false });
                    }
                },

                // Check company DND status from company profile
                async checkCompanyDnd(companyId) {
                    if (!companyId) return;
                    set({ loading: true, error: null });
                    try {
                        const response = await getCompany(companyId);
                       // console.log("ChatDndStore - Company profile response:", response);

                        // Extract DND status from company profile
                        // The DND status should be in the company profile data
                        let dndEnabled = false;
                        if (response?.data?.dndEnabled !== undefined) {
                            dndEnabled = Boolean(response.data.dndEnabled);
                        } else if (response?.dndEnabled !== undefined) {
                            dndEnabled = Boolean(response.dndEnabled);
                        }

                       // console.log("ChatDndStore - Setting company DND status to:", dndEnabled);
                        set({ switchOn: dndEnabled, loading: false });

                        // Reset loading state if needed
                        get().resetLoading();

                        return dndEnabled;
                    } catch (err) {
                        console.error("ChatDndStore - Error checking company DND:", err);
                        set({ error: err?.message || "Failed to check company DND status", loading: false });
                        return null;
                    }
                },

                async checkDnd(senderId, receiverId) {

                    set({ loading: true, error: null });
                    try {
                        const response = await checkDndMode({ senderId, receiverId });

                        if (response?.success === false && response?.message) {

                            set({
                                switchOn: true, // DND is ON when messaging is disabled
                                error: response.message,
                                loading: false
                            });
                            return true;
                        }

                        // Handle case where API returns an error message in data
                        if (response?.data?.message && response?.data?.success === false) {

                            set({
                                switchOn: true, // DND is ON when messaging is disabled
                                error: response.data.message,
                                loading: false
                            });
                            return true;
                        }

                        // Normalize API response → derive dndEnabled (true means DND ON)
                        // Common possibilities: { dndEnabled }, { dnd }, { data: { dndEnabled } }, success meaning allowed
                        const coerceBool = (v) => {
                            if (typeof v === "boolean") return v;
                            if (typeof v === "string") {
                                const lc = v.toLowerCase();
                                if (lc === "true") return true;
                                if (lc === "false") return false;
                            }
                            return undefined;
                        };

                        let dndEnabled = undefined;
                        if (typeof response?.data?.dndEnabled === "boolean") {
                            dndEnabled = response.data.dndEnabled;
                        } else if (typeof response?.data?.dndEnabled === "string") {
                            dndEnabled = coerceBool(response.data.dndEnabled);
                        } else if (typeof response?.dndEnabled === "boolean") {
                            dndEnabled = response.dndEnabled;
                        } else if (typeof response?.dndEnabled === "string") {
                            dndEnabled = coerceBool(response.dndEnabled);
                        } else if (typeof response?.data?.dnd === "boolean") {
                            dndEnabled = response.data.dnd;
                        } else if (typeof response?.data?.dnd === "string") {
                            dndEnabled = coerceBool(response.data.dnd);
                        } else if (typeof response?.dnd === "boolean") {
                            dndEnabled = response.dnd;
                        } else if (typeof response?.dnd === "string") {
                            dndEnabled = coerceBool(response.dnd);
                        } else if (typeof response?.success === "boolean") {
                            // If success=true means chat allowed, then DND is OFF
                            dndEnabled = !response.success;
                        } else if (typeof response === "boolean" || typeof response === "string") {
                            dndEnabled = coerceBool(response);
                        }

                        // Default safely if backend didn't return a boolean
                        if (typeof dndEnabled !== "boolean") dndEnabled = false;

                        set({ switchOn: dndEnabled, loading: false });
                        return dndEnabled;
                    } catch (err) {


                        // Handle different types of errors
                        let errorMessage = "Failed to check DND";

                        if (err?.response?.data?.message) {
                            // API returned an error response with a message
                            errorMessage = err.response.data.message;
                        } else if (err?.message) {
                            // Network or other error with message
                            errorMessage = err.message;
                        } else if (err?.response?.status === 500) {
                            // Server error
                            errorMessage = "Server error occurred while checking DND status";
                        }

                        set({ error: errorMessage, loading: false });
                        return null;
                    }
                },
                async updateDndMode(companyId, dndEnabled) {
                   // console.log("ChatDndStore - updateDndMode called with:", { companyId, dndEnabled });
                    if (!companyId) return;
                    set({ loading: true, error: null });
                    try {
                        const response = await updateCompanyDndMode({ companyId, dndEnabled });
                       // console.log("ChatDndStore - updateCompanyDndMode response:", response);
                        if (response.success) {
                            // Update the local state to match the API response
                            // If API returns success, the dndEnabled value was accepted
                            // So we should set switchOn to match what was sent (dndEnabled)
                           // console.log("ChatDndStore - Setting switchOn to:", dndEnabled);
                            set({ switchOn: dndEnabled, loading: false });
                            return true;
                        } else {
                            set({ error: "Failed to update DND mode", loading: false });
                            return false;
                        }
                    } catch (err) {
                        console.error("ChatDndStore - Error in updateDndMode:", err);
                        set({ error: err?.message || "Failed to update DND mode", loading: false });
                        return false;
                    }
                },
            }),
            {
                name: "chat-dnd-storage", // unique name for localStorage key
                partialize: (state) => ({ switchOn: state.switchOn }), // only persist switchOn state
                onRehydrateStorage: () => (state) => {
                    // When rehydrating from localStorage, set loading if we don't have a valid state
                    if (state && state.switchOn === null) {
                        state.loading = true;
                    }
                },
            }
        ),
        { name: "ChatDndStore" }
    )
);

export default useChatDndStore;


