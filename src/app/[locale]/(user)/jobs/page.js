import JobsMainPage from "@/components/jobs/JobsMainPage";
import { getSeoMeta } from "@/lib/seoMetadata";

export const metadata = getSeoMeta({
  title: "Feed | Jasmina",
  path: "/",
});


const page = () => {
  return (
    <div className="py-3 sm:py-5">
      <JobsMainPage />
    </div>
  );
};

export default page;
