import UserMightKnow from "@/common/UserMightKnow";
import { useTranslations } from "next-intl";
// import FeedPost from "./FeedPost";
import ConnectionsLayout from "../../layout/ConnectionsLayout";
import ChatConnection from "./defaultChat/ChatConnection";

const ChatMainFeed = () => {
  const t = useTranslations("UserMainFeed");
  return (

    <ConnectionsLayout RightComponents={[<UserMightKnow key="right1" />]}>
      <div className="space-y-5">
        <ChatConnection
          key="left1" title="Meassage"
        />

      </div>
    </ConnectionsLayout>
  );
};

export default ChatMainFeed;
