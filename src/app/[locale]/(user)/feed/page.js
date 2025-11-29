import UserMainFeed from "@/components/user/feed/UserMainFeed";
import { getSeoMeta } from "@/lib/seoMetadata";

export const metadata = getSeoMeta({
  title: "Feed | Jasmina",
  path: "/",
});


const page = () => {
  return (
    <div className="py-3 sm:py-5">
      <UserMainFeed />
    </div>
  );
};

export default page;
