import ApplyNowForm from "@/components/jobs/ApplyNowForm/ApplyNowForm";
import { getSeoMeta } from "@/lib/seoMetadata";

export const metadata = getSeoMeta({
  title: "Apply for Job | Jasmina",
  path: "/jobs/apply-now",
});

const ApplyNowPage = ({ params }) => {
  const { id, name } = params;

  return (
    <div>
      <div className="container mx-auto">
        <div className="my-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <ApplyNowForm jobId={id} jobTitle={name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyNowPage;
