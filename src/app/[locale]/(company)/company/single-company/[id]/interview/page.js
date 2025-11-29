// import Interviews from "@/components/SingleCompanyProfile/Interview/Interview";

import MainCompanyProfile from "@/common/MainCompanyProfile";
import UserMightKnow from "@/common/UserMightKnow";
import Interviews from "@/components/SingleCompanyProfile/Interview/Interview";
import CompanyConnectionsLayout from "@/layout/CompanyConnectionsLayout";

const page = () => {
  const userData = {
    companyName: "Company Name",
  };
  return (
    <>
      <div className="py-3 sm:py-5">
        <CompanyConnectionsLayout
          RightComponents={[
            <MainCompanyProfile key="right2" title={userData?.companyName} userData={userData} />,
            <UserMightKnow key="right1" />,
          ]}
        >
          <div className="space-y-5">
            <Interviews />
          </div>
        </CompanyConnectionsLayout>
      </div>
    </>
  );
};

export default page;
