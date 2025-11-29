"use client";

import List from "@/assets/svg/jobs/List";
import Card from "@/common/card/Card";
import CardHeading from "@/common/card/CardHeading";
import useGetAppliedJobs from "@/hooks/job/useGetAppliedJobs";
import useGetSavedJobs from "@/hooks/job/useGetSavedJobs";
import { Link } from "@/i18n/navigation";
import useAppliedJobStore from "@/store/appliedJob.store";
import useJobStore from "@/store/job.store";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { LuBookmark } from "react-icons/lu";
import JobHeader from "../JobHeader";
const MyJobs = ({ filters, setFilters }) => {
  const [showSearch, setShowSearch] = useState(false);
  const savedJobs = useJobStore((state) => state.savedJobs);
  const appliedJobs = useAppliedJobStore((state) => state.appliedJobs);
  // const getSavedJobs = useJobStore((state) => state.getSavedJobs);
  const t = useTranslations("Jobs");
  // const [filters, setFilters] = useState({
  //   search: "",
  //   location: "",
  //   lgbtq: true,
  // });
  const handleFindJob = (newFilters) => {
    setFilters(newFilters);
  };
  // Use the hooks to fetch data
  useGetSavedJobs();
  useGetAppliedJobs();

  // Additional fetch on mount to ensure data is loaded
  // useEffect(() => {
  //   const userId = Cookies.get("userId");
  //   if (userId) {
  //     getSavedJobs({
  //       userId,
  //       onSuccess: () => {
  //         // console.log(t("SavedJobsFetched"));
  //       },
  //       onError: (error) => {
  //         console.error(t("ErrorfetchingsavedjobsinMyJobs:"), error);
  //       },
  //     });
  //   }
  // }, [getSavedJobs]);

  return (
    <div className="myjob-card">
      <Card className="w-full sm:w-auto sm:max-w-full md:sticky md:top-4 md:max-w-full card-main">
        <div className="block d-hidden">
          <CardHeading title={t("myJobs")} />
        </div>
        <div className="flex flex-col mdflex-row justify-between w-full text-[#888DA8] sm:max-w-full lg:max-w-full py-0.5">
          <Link
            href="/jobs/applied-jobs"
            className="no-underline visited:no-underline hover:no-underline focus:no-underline active:no-underline width-sm "
          >
            <div className="flex items-center justify-between md:border-b md:border-[#888DA8]/10 py-3 hover:bg-[#D9D9D9]/[34%]">
              <div className="flex items-center gap-2.5 md:px-4 pl-4  text-gray-500">
                <List className="text-2xl" />
                <span className="text-[13px] font-normal">{t("SubmittedApplications")}</span>
              </div>
              <span className="px-4 text-xs font-bold text-black d-hidden">{appliedJobs.length}</span>
            </div>
          </Link>
          <Link
            href="/jobs/save-jobs"
            className="no-underline visited:no-underline hover:no-underline focus:no-underline active:no-underline width-xs"
          >
            <div className="flex items-center justify-between py-3 hover:bg-[#D9D9D9]/[34%]">
              <div className="flex items-center gap-2.5 md:px-4 text-gray-500">
                <LuBookmark className="text-sm" />
                <span className="text-[13px] font-normal">{t("savedjobs")}</span>
              </div>
              <span className="px-4 text-xs font-bold text-black d-hidden">{savedJobs.length}</span>
            </div>
          </Link>
      
          <div className="text-gray-500 hidden pr-3 lg-flex items-center justify-end w-[10%]">
            <div className="py-3 hover:bg-[#D9D9D9]/[34%]">
              <button
                className="text-gray-500"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FiSearch className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </Card>
      {showSearch && (
        <div className="block pt-2 job-header">
          <JobHeader
            filters={filters}
            setFilters={setFilters}
            showSaveJobsLink={false}
            onFindJob={handleFindJob}
          />
        </div>
      )}
    </div>
  );
};

export default MyJobs;
