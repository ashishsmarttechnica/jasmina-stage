import { getAllMemberships, getPreviousPlans } from "@/api/membership.api";
import Selecter from "@/common/Selecter";
import { useRouter } from "@/i18n/navigation";
import { useIndustryTypeOptions } from "@/utils/selectOptions";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import useAuthStore from "../../../store/auth.store";

const EditCompanySizeForm = ({ formData, errors, handleChange }) => {
  const t = useTranslations("CompanyProfile.industry");
  const params = useParams();
  const {user} = useAuthStore();
  console.log(user ,"user090909");
  
  // Get company ID from URL params or from cookies if creating new company
  const companyId = params?.id || Cookies.get("userId");

  const { data: membershipData, isLoading } = useQuery({
    queryKey: ["memberships", companyId],
    queryFn: () => getAllMemberships(companyId),
    enabled: !!companyId,
  });

  const { data: previousPlansData, isLoading: isPreviousPlansLoading } = useQuery({
    queryKey: ["previousPlans", companyId],
    queryFn: () => getPreviousPlans(companyId),
    enabled: !!companyId,
  });

  const hasPreviousPlan =
    previousPlansData && Array.isArray(previousPlansData.data) && previousPlansData.data.length > 0;

  const router = useRouter();

  const companyTypeOptions = [

       ...(user?.companyType === "ngo" ? [ { label: `${t("companyTypeOption.ngo")}`, value: "ngo" }]:[  { label: `${t("companyTypeOption.startup")}`, value: "startup" },
    { label: `${t("companyTypeOption.smallBusiness")}`, value: "small business" },
    { label: `${t("companyTypeOption.mediumBusiness")}`, value: "medium business" },
    { label: `${t("companyTypeOption.largeBusiness")}`, value: "large business" },
    { label: `${t("companyTypeOption.enterprise")}`, value: "enterprise" },]),
  
  ];
  const industryTypeOptions = useIndustryTypeOptions();

  const employeesOption = useMemo(() => {
    if (!membershipData?.data?.memberships) return [];
    return membershipData.data.memberships.map((plan) => ({
      label: `${plan.employeeRange.min}-${plan.employeeRange.max === 0 ? "+" : plan.employeeRange.max}`,
      value: `${plan.employeeRange.min}-${plan.employeeRange.max === 0 ? "+" : plan.employeeRange.max}`,
    }));
  }, [membershipData]);

  if (isLoading || isPreviousPlansLoading) {
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
            label={`${t("industryType")}`} // No * in edit
            placeholder={t("industryPlaceholder")}
            value={formData.industryType}
            onChange={handleChange}
            options={industryTypeOptions}
            error={errors.industryType}
            isOther={true}
            isMulti={true}
          />
        </div>
        <Selecter
          name="companyType"
          label={`${t("companyType")}`}
          placeholder={t("companyTypePlaceholder")}
          value={formData.companyType}
          onChange={handleChange}
          options={companyTypeOptions}
          error={errors.companyType}
        />
        <Selecter
          name="employees"
          label={`${t("employees")}`}
          placeholder={t("employeesPlaceholder")}
          value={formData.employees}
          onChange={handleChange}
          options={employeesOption}
          error={errors.employees}
          disabled={hasPreviousPlan}
        />
      </div>
      {hasPreviousPlan && (
        <div
          className="mt-2 cursor-pointer text-sm text-red-500 hover:underline"
          onClick={() => {
            const userId = Cookies.get("userId");
            if (userId) {
              router.push(`/company/single-company/${userId}/subscription`);
            } else {
              // fallback: use companyId from params or show error
              router.push(`/company/single-company/${companyId}/subscription`);
            }
          }}
        >
          Your subscription is based on the number of employees. To change it, go to the
          subscription page and request the needed plan from the admin.
        </div>
      )}
    </>
  );
};

export default EditCompanySizeForm;
