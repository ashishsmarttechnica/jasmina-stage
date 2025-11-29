import NotificationMainFeed from "@/components/notifications/NotificationMainFeed";
import { getSeoMeta } from "@/lib/seoMetadata";

export const metadata = getSeoMeta({
  title: "Feed | Jasmina",
  path: "/",
});

const page = () => {
  return (
    <div className="py-3 sm:py-5">
      <NotificationMainFeed />
    </div>
  );
};

export default page;


