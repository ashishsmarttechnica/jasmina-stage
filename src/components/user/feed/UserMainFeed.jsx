import Profile from "@/common/Profile";
import UserConnections from "@/common/UserConnections";
import UserMightKnow from "@/common/UserMightKnow";
import UserNetworkInvites from "@/common/UserNetworkInvites";
import MainLayout from "@/layout/MainLayout";
import { useTranslations } from "next-intl";
import FeedPost from "./FeedPost";
import CompanyConnections from "../../../common/CompanyConnections";

const UserMainFeed = () => {
  const t = useTranslations("UserMainFeed");
  return (
    <MainLayout
      leftComponents={[
        <Profile key="left1" />,
        <UserConnections key="left2" title={t("userConnections")} />,
        <CompanyConnections key="left3" title={t("companyConnections")} />,
      ]}
      rightComponents={[
        <UserMightKnow key="right1" />,
        <UserNetworkInvites
          key="right2"
          title={t("networkInvites")}
          type="invites"
          buttonType="invite"
        />,
      ]}
    >
      <FeedPost isUser={true} />
    </MainLayout>
  );
};

export default UserMainFeed;
