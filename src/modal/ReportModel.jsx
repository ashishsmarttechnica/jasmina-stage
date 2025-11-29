import { useCreateReport } from "@/hooks/report/useReport";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { useTranslations } from "next-intl";
import { IoClose } from "react-icons/io5";
import { Modal } from "rsuite";
import capitalize from "../lib/capitalize";

function ReportModel({ isOpen, onClose, userData }) {
  console.log(userData?.role, "userData123456789123456789");
  const reportedTypeRole =
    userData?.role === "company" ? "Company" : userData?.role === "user" ? "User" : userData?.role;
  // console.log();

  // console.log(reportedTypeRole, "reportedTypeRolereportedTypeRolereportedTypeRole");
  const t = useTranslations("Report");
  const userType = capitalize(Cookies.get("userRole"));
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");

  const params = useParams();
  // console.log(params, "params");
  const reporterUserId = Cookies.get("userId");
  const reportedUserId = params?.id;

  const { mutate: submitReport, isPending: isSubmitting } = useCreateReport();

  const handleSubmit = () => {
    if (!selectedReason) {
      toast.error("Please select a reason");
      return;
    }

    submitReport(
      {
        reporterUserId,
        reportedUserId,
        reason: selectedReason,
        description,
        reporterType: userType === "User" ? "User" : "Company",
        reportedType: reportedTypeRole,
      },
      {
        onSuccess: () => {
          setSelectedReason("");
          setDescription("");
          onClose();
        },
      }
    );
  };
  const reportReasons = [
    t("SpamAdvertising"),
    t("HarassmentBullying"),
    userType === "user" ? t("FakeProfile") : t("FakeCompany"),
    t("FakeUserProfile"),
    t("InappropriateContent"),
    t("Other"),
  ];
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="sm"
      className="!max-h-[90vh] !w-[95%] overflow-hidden !p-0 sm:!max-h-[85vh] sm:!w-[90%] md:!w-[547px]"
    >
      <Modal.Body className="no-scrollbar h-full overflow-y-auto rounded-lg bg-white !p-1 sm:p-4 md:p-6">
        <div className="relative mb-4">
          <button
            onClick={onClose}
            className="absolute top-1 right-1 text-gray-500 hover:text-black sm:top-0 sm:right-0"
          >
            <IoClose className="text-[24px] text-black sm:text-[28px]" />
          </button>

          <div className="w-full">
            <div className="mx-auto mt-4 mb-4 flex max-w-[284px] flex-col text-center">
              <span className="text-[16px] font-medium text-black sm:text-[17px]">
                 {userData?.role === "user" ? t("ReportThisUser") : t("ReportThisCompany")}
              </span>
              <p className="text-[13px] font-normal text-[#888DA8] sm:text-[15px]">
                {t("ReportDescription")}
              </p>
            </div>

            <p className="mb-2 text-[15px] font-medium text-black sm:mb-[5px] sm:text-[16px]">
              {t("ChooseReason")}
            </p>

            <div className="flex flex-col gap-2.5">
              {reportReasons.map((reason, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 text-[14px] font-normal text-[#888DA8]"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    className="peer sr-only"
                    onChange={() => setSelectedReason(reason)}
                    checked={selectedReason === reason}
                  />
                  <div className="peer-checked:border-primary flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-400">
                    <div
                      className={`h-2 w-2 rounded-full bg-green-700 ${selectedReason === reason ? "visible" : "invisible"}`}
                    />
                  </div>
                  {reason}
                </label>
              ))}

              <p className="pt-4 text-[15px] font-medium text-black sm:text-[16px]">
                {t("Tellusmore")}
              </p>

              <textarea
                placeholder={t("Tellusmore")}
                className="mt-2 h-[120px] w-full resize-none rounded-[6px] border-none bg-[#EDF2F6] p-2 pl-4 text-[13px] text-[#888DA8] outline-none sm:h-[158px] sm:pl-6 sm:text-[14px]"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="flex w-full items-center justify-end pt-4">
                <button
                  className="bg-primary hover:bg-secondary hover:text-primary rounded-md px-6 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:text-[15px]"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("Submitting") : t("submSubmitReportit")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ReportModel;
