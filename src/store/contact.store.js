import axios from "@/lib/axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useContactStore = create(
    devtools(
        (set, get) => ({
            loading: false,
            success: false,
            error: null,
            contactData: null,

            createContact: async (contactData) => {
                set({ loading: true, error: null, success: false });
                try {
                    const response = await axios.post("/create/contactUs", contactData);
                    set({
                        loading: false,
                        success: true,
                        contactData: response.data,
                        error: null
                    });
                    return response.data;
                } catch (error) {
                    const errorMessage = error.response?.data || "Something went wrong";
                    set({
                        loading: false,
                        success: false,
                        error: errorMessage
                    });
                    throw error;
                }
            },

            clearContactState: () => {
                set({
                    loading: false,
                    success: false,
                    error: null,
                    contactData: null,
                });
            },
        }),
        {
            name: "ContactStore",
        }
    )
);

export default useContactStore;
