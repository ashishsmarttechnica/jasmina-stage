import MainSingleUser from "@/components/user/singleUser/MainSingleUser";
import { getSeoMeta } from "@/lib/seoMetadata";


export const metadata = getSeoMeta({
  title: "single-user | Jasmina",
  path: "/",
});

const page = () => {
  return (
    <div className="py-3 sm:py-5">
      <MainSingleUser />
    </div>
  );
};

export default page;
