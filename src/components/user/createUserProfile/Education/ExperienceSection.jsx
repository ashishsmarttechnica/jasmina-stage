import CustomDatePicker from "@/common/DatePicker";
import InputField from "@/common/InputField";
import { usePositionOptions } from "@/utils/selectOptions";
import { useTranslations } from "next-intl";
import { FiPlusSquare } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import Selecter from "../../../../common/Selecter";
const ExperienceSection = ({
  experienceList,
  addSection,
  removeSection,
  handleChange,
  errors,
  clearFieldError,
}) => {
  const t = useTranslations("UserProfile.education");
  const positionOptions = usePositionOptions();
  const handleDateChange = (date, type, index) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    handleChange("experienceList", index, type, formattedDate);

    // Clear the error when date is selected
    clearFieldError(`experience-${index}-${type}`);

    // If changing start date and it's after end date, clear end date
    if (type === "startDate") {
      const endDate = experienceList[index].endDate
        ? new Date(experienceList[index].endDate)
        : null;
      if (endDate && date && date > endDate) {
        handleChange("experienceList", index, "endDate", "");
      }
    }
  };

  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <div className="text-[15px] font-medium text-[#0f0f0f]">{t("Experience")}</div>
        <FiPlusSquare
          onClick={() => addSection("experienceList")}
          className="h-[19px] w-[19px] cursor-pointer"
        />
      </div>

      {experienceList.map((experience, index) => (
        <div
          key={index}
          className={`${
            index > 0 ? "relative border border-[#ddd]" : ""
          } grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 ${
            index > 0 ? "mt-2 rounded-md p-4" : ""
          }`}
        >
          {index > 0 && (
            <RxCross2
              onClick={() => removeSection("experienceList", index)}
              className="absolute top-2 right-2 cursor-pointer"
            />
          )}

          <InputField
            label={`${t("Company Name")}`}
            name={`companyName-${index}`}
            type="text"
            value={experience.companyName}
            onChange={(e) => handleChange("experienceList", index, "companyName", e.target.value)}
            onBlur={() => clearFieldError(`experience-${index}-companyName`)}
            // error={errors[`experience-${index}-companyName`]}
          />

          <InputField
            label={`${t("Role")}`}
            name={`role-${index}`}
            type="text"
            value={experience.role}
            onChange={(e) => handleChange("experienceList", index, "role", e.target.value)}
            onBlur={() => clearFieldError(`experience-${index}-role`)}
            // error={errors[`experience-${index}-role`]}
          />

          <CustomDatePicker
            label={`${t("Start Date")}`}
            value={experience.startDate || ""}
            onChange={(date) => handleDateChange(date, "startDate", index)}
            maxDate={new Date()}
            // error={errors[`experience-${index}-startDate`]}
          />

          <CustomDatePicker
            label={`${t("End Date")}`}
            value={experience.endDate || ""}
            onChange={(date) => handleDateChange(date, "endDate", index)}
            minDate={experience.startDate ? new Date(experience.startDate) : undefined}
            maxDate={new Date()}
            // error={errors[`experience-${index}-endDate`]}
          />

          <InputField
            label={`${t("Location")}`}
            name={`location-${index}`}
            type="text"
            value={experience.location}
            onChange={(e) => handleChange("experienceList", index, "location", e.target.value)}
            onBlur={() => clearFieldError(`experience-${index}-location`)}
            // error={errors[`experience-${index}-location`]}
          />
          <Selecter
            label={`${t("Position")}`}
            name={`position-${index}`}
            value={experience.position}
            onChange={(e) => handleChange("experienceList", index, "position", e.target.value)}
            // error={errors[`experience-${index}-position`]}
            options={positionOptions}
            placeholder={t("Position")}
            isOther={true}
          />
        </div>
      ))}
    </div>
  );
};

export default ExperienceSection;
