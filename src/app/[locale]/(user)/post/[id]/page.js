
import SinglePostLayout from "@/layout/SinglePostLayout";
import { getSeoMeta } from "@/lib/seoMetadata";

export const metadata = getSeoMeta({
  title: "Feed | Jasmina",
  path: "/",
});

const page = () => {
  return (
    <div className="py-3 sm:py-5">
      <SinglePostLayout />
    </div>
  );
};

export default page;
