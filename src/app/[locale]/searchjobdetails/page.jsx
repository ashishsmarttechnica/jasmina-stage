"use client";
import JobSearchResults from "@/components/jobSearch/JobSearchResults";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        setCurrentPage(1);
        searchJobs({
            search,
            location,
            lgbtq,
            page: 1,
            limit: 5,
            isAppend: false
        });
    }, [search, location, lgbtq, searchJobs]);

    useEffect(() => {
        if (currentPage > 1) {
            searchJobs({
                search,
                location,
                lgbtq,
                page: currentPage,
                limit: 5,
                isAppend: true
            });
        }
    }, [currentPage, searchJobs]);

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
