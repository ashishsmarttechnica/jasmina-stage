import axios from "@/lib/axios";

// Get Privacy Policy from your backend
export const getPrivacyPolicy = async () => {
    try {
        const response = await axios.get("/api/privacy-policy");
        return response.data;
    } catch (error) {
        console.error("Error fetching privacy policy:", error);
        throw error;
    }
};

// Get Terms & Conditions from your backend
export const getTermsConditions = async () => {
    try {
        const response = await axios.get("/api/terms-conditions");
        return response.data;
    } catch (error) {
        console.error("Error fetching terms & conditions:", error);
        throw error;
    }
};

// Update Privacy Policy (if you need admin functionality)
export const updatePrivacyPolicy = async (data) => {
    try {
        const response = await axios.put("/api/privacy-policy", data);
        return response.data;
    } catch (error) {
        console.error("Error updating privacy policy:", error);
        throw error;
    }
};

// Update Terms & Conditions (if you need admin functionality)
export const updateTermsConditions = async (data) => {
    try {
        const response = await axios.put("/api/terms-conditions", data);
        return response.data;
    } catch (error) {
        console.error("Error updating terms & conditions:", error);
        throw error;
    }
};

