import axios from "@/lib/axios";

// Get Privacy Policy
export const getPrivacy = async () => {
    const res = await axios.get("/privacy-policy");
    return res.data;
};

// Get Terms & Conditions
export const getTerms = async () => {
    const res = await axios.get("/terms-conditions");
    return res.data;
};

