"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";

const JobHeaderHome = ({ filters, setFilters, onFindJob }) => {
    const t = useTranslations("Jobs");

    const [searchInput, setSearchInput] = useState(filters.search || "");
    const [locationInput, setLocationInput] = useState(filters.location || "");
    const [showRemoteJobsOnly, setShowRemoteJobsOnly] = useState(false);

    useEffect(() => {
        setFilters({
            search: searchInput,
            location: locationInput,
            lgbtq: filters.lgbtq || false,
            remote: false,
        });
    }, []);

    const handleFindJob = () => {
        const newFilters = {
            search: searchInput,
            location: showRemoteJobsOnly ? "Remote" : locationInput,
            lgbtq: false,
            remote: showRemoteJobsOnly,
        };
        setFilters(newFilters);
        if (onFindJob) onFindJob(newFilters);
    };

    const clearFilters = () => {
        setSearchInput("");
        setLocationInput("");
        setShowRemoteJobsOnly(false);

        setFilters({
            search: "",
            location: "",
            lgbtq: false,
            remote: false,
        });
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-4 w-full flex flex-col gap-4">

            {/* --- GRID FOR FIELDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* SEARCH FIELD */}
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                    <FiSearch className="text-gray-500 text-xl mr-2" />
                    <input
                        type="text"
                        placeholder={t("jobTitleOrCompanyPlaceholder")}
                        className="w-full text-base outline-none"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                {/* LOCATION FIELD */}
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                    <HiOutlineLocationMarker className="text-gray-500 text-2xl mr-2" />
                    <input
                        type="text"
                        placeholder={t("location")}
                        className="w-full text-base outline-none"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                    />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3">

                    {/* CLEAR BUTTON */}
                    <button
                        onClick={clearFilters}
                        className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600 rounded-md p-2 w-12 text-xl"
                    >
                        <AiOutlineClear />
                    </button>

                    {/* FIND JOB BUTTON */}
                    <button
                        onClick={handleFindJob}
                        className="bg-[#0F8200] hover:bg-[#0c6600] text-white px-6 py-2.5 font-medium rounded-md w-full"
                    >
                        {t("findJob")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobHeaderHome;
