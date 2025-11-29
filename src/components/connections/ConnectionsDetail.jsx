"use client";
import UserMightKnow from "@/common/UserMightKnow";
import ConnectionsLayout from "@/layout/ConnectionsLayout";
import { useTranslations } from "next-intl";
import UserNetworkInvites from "../../common/UserNetworkInvites";
import ConnectionsContent from "./ConnectionsContent";
const ConnectionsDetail = () => {
  const t = useTranslations("UserMainFeed");
  return (
    <div className="space-y-6 lg:space-y-8">
      <ConnectionsLayout RightComponents={[<UserMightKnow key="right1" />]}>
        <div className="space-y-6">
          <ConnectionsContent />


          <div className="block lg:hidden">
            <UserMightKnow />
          </div>
          <div className="block lg:hidden">
            <UserNetworkInvites title={t("networkInvites")} />
          </div>
        </div>
      </ConnectionsLayout>
    </div>
  );
};

export default ConnectionsDetail;
