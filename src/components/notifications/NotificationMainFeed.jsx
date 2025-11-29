import Profile from "@/common/Profile";
import UserMightKnow from "@/common/UserMightKnow";
import MainLayout from "@/layout/MainLayout";
import Cookies from "js-cookie";
import capitalize from "../../lib/capitalize";
import Notification from "./Notification";
const NotificationMainFeed = () => {
  const userType = capitalize(Cookies.get("userRole"));

  return (
    <MainLayout
      leftComponents={[<Profile key="left1" />]}
      rightComponents={[<UserMightKnow key="right2" />]}
    >
      <Notification />
    </MainLayout>
  );
};

export default NotificationMainFeed;
