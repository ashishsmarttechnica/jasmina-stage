import { getMembership } from "@/api/membership.api";
import Selecter from "@/common/Selecter";
import { useIndustryTypeOptions } from "@/utils/selectOptions";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const CompanySizeForm = ({ formData, errors, handleChange }) => {
  const t = useTranslations("CompanyProfile.industry");
  const params = useParams();
  // Get company ID from URL params or from cookies if creating new company
  const companyId = params?.id || Cookies.get("userId");
  // console.log(params, companyId)
  const { data: membershipData, isLoading } = useQuery({
    queryKey: ["memberships"],
    queryFn: () => getMembership(),
  });
  const companyTypeOptions = [
    { label: `${t("companyTypeOption.ngo")}`, value: "ngo" },
    { label: `${t("companyTypeOption.startup")}`, value: "startup" },
    { label: `${t("companyTypeOption.smallBusiness")}`, value: "small business" },
    { label: `${t("companyTypeOption.mediumBusiness")}`, value: "medium business" },
    { label: `${t("companyTypeOption.largeBusiness")}`, value: "large business" },
    { label: `${t("companyTypeOption.enterprise")}`, value: "enterprise" },
  ];
  const industryTypeOptions = useIndustryTypeOptions();

  const employeesOption = useMemo(() => {
    if (!membershipData?.data) return [];
    return membershipData.data.map((plan) => ({
      label: `${plan.employeeRange.min}-${plan.employeeRange.max === 0 ? "+" : plan.employeeRange.max} `,
      value: `${plan.employeeRange.min}-${plan.employeeRange.max === 0 ? "+" : plan.employeeRange.max}`,
      eligibility: plan.eligibility, // add eligibility as a property if you need it elsewhere
    }));
  }, [membershipData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="my-4 text-center">
        <p className="mt-7 text-[15px] font-medium">{t("title")}</p>
        <p className="text-grayBlueText text-[13px]">{t("subTitle")}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="col-span-2">
          <Selecter
            name="industryType"
            label={`${t("industryType")}*`}
            placeholder={t("industryPlaceholder")}
            value={formData.industryType}
            onChange={handleChange}
            options={industryTypeOptions}
            error={errors.industryType}
            isOther={true}
            isMulti={true}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Selecter
            name="companyType"
            label={`${t("companyType")}*`}
            placeholder={t("companyTypePlaceholder")}
            value={formData.companyType}
            onChange={handleChange}
            options={companyTypeOptions}
            error={errors.companyType}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Selecter
            name="employees"
            label={`${t("employees")}*`}
            placeholder={t("employeesPlaceholder")}
            value={formData.employees}
            onChange={handleChange}
            options={employeesOption}
            error={errors.employees}
          />
        </div>
      </div>
    </>
  );
};

export default CompanySizeForm;
