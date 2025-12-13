"use client";
import JobSearchResults from "@/components/jobSearch/JobSearchResults";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Header from "../../../components/header/Header";

import { useSearchGlobalJobs } from "@/hooks/job/useSearchGlobalJobs";
import useJobStore from "@/store/job.store";

function SearchJobDetailsContent() {
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const lgbtq = searchParams.get("lgbtq") || "";

    const { jobs, isLoading: loading, error, pagination } = useJobStore();
    const [currentPage, setCurrentPage] = useState(1);
    const { mutateAsync: searchJobs } = useSearchGlobalJobs();
    const isSearchingRef = useRef(false);

    useEffect(() => {
        setCurrentPage(1);

        // Prevent multiple simultaneous calls
        if (isSearchingRef.current) return;

        isSearchingRef.current = true;
        searchJobs({
            search,
            location,
            lgbtq,
            page: 1,
            limit: 5,
            isAppend: false
        })
            .catch((err) => {
                // Silently handle errors - they're already handled in the hook
                console.error("Search error:", err);
            })
            .finally(() => {
                isSearchingRef.current = false;
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, location, lgbtq]);

    useEffect(() => {
        if (currentPage > 1 && !isSearchingRef.current) {
            isSearchingRef.current = true;
            searchJobs({
                search,
                location,
                lgbtq,
                page: currentPage,
                limit: 5,
                isAppend: true
            })
                .catch((err) => {
                    // Silently handle errors - they're already handled in the hook
                    console.error("Search error:", err);
                })
                .finally(() => {
                    isSearchingRef.current = false;
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, search, location, lgbtq]);

    return (
        <>
            <Header isLogin={false} />
            <JobSearchResults
                jobs={jobs}
                loading={loading}
                error={error}
                search={search}
                location={location}
                lgbtq={lgbtq}
                totalJobs={pagination?.total || 0}
                currentPage={currentPage}
                totalPages={pagination?.totalPages || 1}
                onPageChange={setCurrentPage}
            />
        </>
    );
}

export default function SearchJobDetailsPage() {
    return (
        <SearchJobDetailsContent />
    );
}
