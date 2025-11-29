// import JobsMainPage from "@/components/jobs/JobsMainPage";
import { getSeoMeta } from "@/lib/seoMetadata";
import SaveJobsMainPage from "../../../../../components/jobs/SaveJobsMainPage";
// import SaveDefaultJob from "../../../../../components/jobs/defaultJob/SaveDefaultJob";

export const metadata = getSeoMeta({
  title: "Feed | Jasmina",
  path: "/",
});

const page = () => {
  return (
    <div className="py-3 sm:py-5">
      <SaveJobsMainPage />
    </div>
  );
};

export default page;
