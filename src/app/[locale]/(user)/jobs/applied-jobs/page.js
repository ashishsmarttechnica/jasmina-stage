import { getSeoMeta } from "@/lib/seoMetadata";
import AppliedJobsMainPage from "../../../../../components/jobs/AppliedJobsMainPage";

export const metadata = getSeoMeta({
  title: "Applied Jobs | Jasmina",
  path: "/jobs/applied-jobs",
});

const page = () => {
  return (
    <div className="py-3 sm:py-5">
      <AppliedJobsMainPage />
    </div>
  );
};

export default page;
