"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import JobsLayout from "../../layout/JobsLayout";
import JobHeader from "./JobHeader";
import MyJobs from "./leftSidebar/MyJobs";
import SaveJobCards from "./SaveJobCards";

const SaveJobsMainPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    lgbtq: false,
  });

  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  return (
    <JobsLayout leftComponents={[<MyJobs key="left1" filters={filters} setFilters={setFilters} />]}>
      <div className="w-full myjob-card">
        <div className="d-hidden block">
          <JobHeader filters={filters} setFilters={setFilters} showSaveJobsLink={false} />
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div className="">
            <SaveJobCards filters={filters} jobId={jobId} isSavedJobs={true} />
          </div>
        </div>
      </div>
    </JobsLayout>
  );
};

export default SaveJobsMainPage;
