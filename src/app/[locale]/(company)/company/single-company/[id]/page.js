import MainSingleCompany from "@/components/company/singleCompany/MainSingleCompany";
import { getSeoMeta } from "@/lib/seoMetadata";

export const metadata = getSeoMeta({
  title: "single-company | Jasmina",
  path: "/",
});

const page = () => {
  return (
    <div className="py-3 sm:py-5">
      <MainSingleCompany />
    </div>
  );
};

export default page;
