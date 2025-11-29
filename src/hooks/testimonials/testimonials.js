import { getTestimonials } from "@/api/testimonial.api";
import { useQuery } from "@tanstack/react-query";

export const useTestimonials = ({ page, limit }) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["testimonials", page, limit],
        queryFn: () => getTestimonials({ page, limit }),
    });

    // Extract testimonials array from response
    const testimonials = data?.data || [];

    return { 
        testimonials, 
        isLoading, 
        isError, 
        error 
    };
};