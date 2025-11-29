import Activity from "@/assets/svg/user/Activity";
import UserActivitySkeleton from "@/common/skeleton/UserActivitySkeleton";
import { FaArrowRight } from "react-icons/fa6";
import PostSlider from "./PostSlider";
import { useTranslations } from "next-intl";

const ActivitySection = ({ userData, isLoading }) => {
  // Get user posts from userData
  const userPosts = userData?.userPost || [];
  const t=useTranslations('UserProfile.profile.singleprofileTab');
  // console.log("userPoststotal", userData);

  const hasNoPosts = !isLoading && (!userPosts || userPosts.length === 0);

  return (
    <div className="shadow-card rounded-[5px] bg-gray-50">
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Activity /> {t('activity')}
        </h2>
        <div className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#888DA8] no-underline">
          {userData?.totalPost > 5 ? (
            <>
              {t('seeAll')} <FaArrowRight className="text-xl font-normal" />
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="m-5 pb-4">
        {isLoading ? (
          <UserActivitySkeleton />
        ) : hasNoPosts ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mb-2 text-lg font-medium text-gray-400">{t('noActivity')}</div>
            <p className="text-sm text-gray-400">{t('noActivityDesc')}</p>
          </div>
        ) : (
          // <PostSlider posts={userPosts} />
          <PostSlider posts={userPosts} userData={userData} />
        )}
      </div>
    </div>
  );
};

export default ActivitySection;
