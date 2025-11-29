"use client";
import InputField from "@/common/InputField";
import { useTranslations } from "next-intl";
import { useState } from "react";

const SalaryRangeInput = ({ onSalaryChange, initialValue = "" }) => {
  const [salaryRange, setSalaryRange] = useState(initialValue);
  const [formatType, setFormatType] = useState("range");
  const t = useTranslations("CreateJobForm");

  const formats = [
    { id: "range", label: t("salaryStep.formatTabs.range") },
    { id: "lpa", label: t("salaryStep.formatTabs.lpa") },
  ];

  const handleSalaryChange = (value) => {
    setSalaryRange(value);
    onSalaryChange(value);
  };

  const getPlaceholder = () => {
    return formatType === "range"
      ? t("salaryStep.placeholder.ranges")
      : t("salaryStep.placeholder.lpa");
  };

  const handleFormatChange = (format) => {
    setFormatType(format);
    setSalaryRange("");
    onSalaryChange("");
  };

  return (
    <div className="mb-3">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-grayBlueText text-[15px] font-medium">{t("salaryStep.salaryRangeLabel")}</label>

        <div className="flex items-center gap-3 text-sm">
          {formats.map((format) => (
            <div
              key={format.id}
              className={`cursor-pointer rounded-md px-3 py-1 transition-all ${formatType === format.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-gray-100"
                }`}
              onClick={() => handleFormatChange(format.id)}
            >
              {format.label}
            </div>
          ))}
        </div>
      </div>

      <InputField
        type="text"
        value={salaryRange}
        onChange={(e) => handleSalaryChange(e.target.value)}
        placeholder={getPlaceholder()}
      />

      {formatType === "range" && (
        <p className="mt-1 text-xs text-gray-500">{t("salaryStep.help.ranges")}</p>
      )} 
      {formatType === "lpa" && (
        <p className="mt-1 text-xs text-gray-500">{t("salaryStep.help.lpa")}</p>
      )}
    </div>
  );
};

export default SalaryRangeInput;
