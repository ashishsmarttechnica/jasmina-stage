import axios from "@/lib/axios";

// Get Testimonials
export const getTestimonials = async ({page, limit}) => {
    const res = await axios.get(`/get/testimonial?page=${page}&limit=${limit}`);
    return res.data;
};