import SharedJobDetail from "@/components/jobs/SharedJobDetail";
import { getSeoMeta } from "@/lib/seoMetadata";

export const metadata = getSeoMeta({
  title: "Job Detail | Jasmina",
  path: "/jobs",
});

const JobDetailPage = ({ params }) => {
  const { jobId } = params;

  return (
    <div className="py-3 sm:py-5">
      <SharedJobDetail jobId={jobId} />
    </div>
  );
};

export default JobDetailPage;

