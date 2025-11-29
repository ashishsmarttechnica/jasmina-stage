import { planRequest } from "@/api/membership.api";
import back from "@/assets/Subscription/back.png";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Swal from "sweetalert2";

const SubscriptionCard = ({
  title,
  price,
  handleUpgrade,
  eligibility,
  employeeRange,
  isActive,
  rejectReason,
  isCurrentPlan,
  suitable,
  membershipActive,
  newMembershipId, 
  queryClient, 
  companyId, 
}) => {
  // console.log(suitable, "suitablesuitablesuitablesuitable");
  const t = useTranslations("Subscription");

  // Add a handler for Request Admin
  const handleRequestAdmin = async () => {
    const companyId = Cookies.get("userId");
    if (!companyId) {
      Swal.fire({ icon: "error", title: t("noCompanyIdTitle"), text: t("noCompanyIdText") });
      return;
    }
    const { value: reason } = await Swal.fire({
      title: t("requestAdminTitle"),
      input: "textarea",
      inputLabel: t("requestAdminReasonLabel"),
      inputPlaceholder: t("requestAdminReasonPlaceholder"),
      inputAttributes: { "aria-label": "Reason" },
      showCancelButton: true,
      confirmButtonText: t("submit"),
      cancelButtonText: t("cancel"),
    });
    if (reason) {
      try {
        const res = await planRequest({
          companyId,
          newMembershipId,
          companyReason: reason,
        });
        if (res?.success) {
          Swal.fire({
            icon: "success",
            title: t("requestSentTitle"),
            text: t("requestSentText"),
            confirmButtonText: t("ok"),
          });
          if (queryClient && companyId) {
            queryClient.invalidateQueries(["memberships", companyId]);
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: t("message"),
            text: res?.message || t("requestFailed"),
            confirmButtonText: t("ok"),
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "warning",
          title: t("message"),
          text: err?.response?.data?.message || err.message || t("requestFailed"),
          confirmButtonText: t("ok"),
        });
      }
    }
  };

  return (
    <div className={`relative z-0 overflow-hidden rounded-lg bg-white p-6`}>
      <div className="absolute inset-0 z-0">
        <Image
          src={back}
          alt="background"
          // fill
          className="h-[114.73px] w-[400px] object-cover"
          // height={90}
          // width={90}
          priority
        />
      </div>

      <div className="relative z-10">
        <div className="mb-4">
          <h3 className="text-primary text-md font-medium leading-relaxed break-words">{title}</h3>
          <div className="text-primary mt-2 text-right text-[50px] font-bold leading-relaxed break-words">€{price}</div>
          <p className="mt-4 text-center text-gray-600 leading-relaxed break-words">
            {eligibility}
            {employeeRange && (
              <span className="block text-sm leading-relaxed break-words">
                ({employeeRange.min} {t("to")} {employeeRange.max} {t("employees")})
              </span>
            )}
          </p>
        </div>
        {suitable === true ? (
          membershipActive === true ? (
            <div className="text-center font-semibold text-green-600">{t("planActive")}</div>
          ) : (
            <button
              className="bg-primary mx-auto flex items-center justify-center rounded-md px-6 py-2 text-white hover:bg-green-700"
              onClick={handleUpgrade}
            >
              {t("upgrade")}
            </button>
          )
        ) : (
          <button
            className="bg-primary mx-auto flex items-center justify-center rounded-md px-6 py-2 text-white hover:bg-green-700"
            onClick={handleRequestAdmin}
          >
            {t("requestAdmin")}
          </button>
        )}
        {rejectReason && (
          <div className="mt-2 max-w-[350px] truncate text-center text-red-600 leading-relaxed break-words">{`${t("reason")}: ${rejectReason}`}</div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;

