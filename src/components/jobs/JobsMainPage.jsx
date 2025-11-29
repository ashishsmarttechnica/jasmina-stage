"use client";
import JobsLayout from "@/layout/JobsLayout";
import { useState } from "react";
import DefaultJob from "./defaultJob/DefaultJob";
import MyJobs from "./leftSidebar/MyJobs";

const JobsMainPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    lgbtq: false,
  });
  return (
    <JobsLayout leftComponents={[<MyJobs key="left1" filters={filters} setFilters={setFilters} />]}>
      <DefaultJob filters={filters} setFilters={setFilters} />
    </JobsLayout>
  );
};

export default JobsMainPage;
