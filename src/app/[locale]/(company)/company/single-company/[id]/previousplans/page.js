// import ApplicationJobContent from "@/components/applicationJob/ApplicationJobContent";

import MainCompanyProfile from "@/common/MainCompanyProfile";
import UserMightKnow from "@/common/UserMightKnow";
import CompanyConnectionsLayout from "@/layout/CompanyConnectionsLayout";
import PreviousPlanCard from "../../../../../../../components/SingleCompanyProfile/previousplans/PreviousPlanCard";

const Page = ({ params }) => {
  const userData = {
    companyName: "Company Name",
  };

  return (
    <div className="py-3 sm:py-5">
      <CompanyConnectionsLayout
        RightComponents={[
          <MainCompanyProfile key="right2" title={userData?.companyName} userData={userData} />,
          <UserMightKnow key="right1" />,
        ]}
      >
        <div className="space-y-5">
          <PreviousPlanCard companyId={params.id} />
        </div>
      </CompanyConnectionsLayout>
    </div>
  );
};

export default Page;
