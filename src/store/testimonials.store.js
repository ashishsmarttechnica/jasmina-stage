import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useTestimonialsStore = create(
    devtools(
        (set) => ({
            // Testimonials data
            testimonials: [],
            isLoading: true,
            error: null,


            // Actions
            setTestimonials: (testimonials) => set({ testimonials }),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
        

            // Reset store
            resetStore: () =>
                set({
                    testimonials: [],
                    isLoading: true,
                    error: null,
            
                }),
        }),
        { name: "TestimonialsStore" }
    )
);

export default useTestimonialsStore;