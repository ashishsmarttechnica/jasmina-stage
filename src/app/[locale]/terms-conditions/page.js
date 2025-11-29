"use client";

import { getTerms } from "@/api/privacy-terms.api";
import BackGroundLayout from "@/components/BackGroundOverlay/BackGroundLayout";
import { useEffect, useState } from "react";

const TermsConditions = () => {
    const [termsData, setTermsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTermsData = async () => {
            try {
                setLoading(true);
                const response = await getTerms();
                setTermsData(response.data);
            } catch (err) {
                console.error("Error fetching terms & conditions:", err);
                setError("Failed to load terms & conditions");
            } finally {
                setLoading(false);
            }
        };

        fetchTermsData();
    }, []);

    if (loading) {
        return (
            <>
                <BackGroundLayout />
                <div className="max-w-4xl mx-auto p-2 py-6 sm:p-6 text-gray-800 space-y-2">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <BackGroundLayout />
                <div className="max-w-4xl mx-auto p-2 py-6 sm:p-6 text-gray-800 space-y-2">
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <BackGroundLayout />
            <div className="max-w-4xl mx-auto p-2 py-6 sm:p-6 text-gray-800 space-y-2">
                <main className="relative">
                    <div className="customList">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: termsData?.information_Description || "No content available",
                            }}
                        ></div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default TermsConditions;

