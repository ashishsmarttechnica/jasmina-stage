import { useTranslations } from "next-intl";
import CompanyCard from "./CompanyCard";
import LoadMoreButton from "./LoadMoreButton";
import PeopleCard from "./PeopleCard";

const ConnectionsList = ({ activeTab, connections = [], hasMore, isFetching, loadMore, userData, profileId }) => {
  const t = useTranslations("CompanyProfile.singleCompanyTab");
  // Ensure connections is always an array
  const connectionsList = Array.isArray(connections) ? connections : [];

  return (
    <>
      {connectionsList.length > 0 ? (
        <>
          {connectionsList.map((item) =>
            activeTab === "people" ? (
              <PeopleCard key={item._id} person={item} profileId={profileId} />
            ) : (
              <CompanyCard key={item._id} company={item} userData={userData} profileId={profileId} />
            )
          )}
        </>
      ) : (
        <div className="py-4 text-center text-gray-500">{t("noconnections")}</div>
      )}

      {hasMore && <LoadMoreButton onClick={loadMore} isLoading={isFetching} />}
    </>
  );
};

export default ConnectionsList;
