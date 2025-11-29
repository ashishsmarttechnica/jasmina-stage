import InputField from "@/common/InputField";
import { useTranslations } from "next-intl";
import { FiPlusSquare } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const EducationSection = ({
  educationList,
  addSection,
  removeSection,
  handleChange,
  errors,
  clearFieldError,
}) => {
  const t = useTranslations("UserProfile.education");
  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <div className="text-[15px] font-medium text-[#0f0f0f]">{t("educationSection")}</div>
        <FiPlusSquare
          onClick={() => addSection("education")}
          className="h-[19px] w-[19px] cursor-pointer"
        />
      </div>
      {educationList.map((edu, index) => (
        <div
          key={index}
          className={`${index > 0 ? "relative border border-[#ddd]" : ""
            } grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 ${index > 0 ? "mt-2 rounded-md p-4" : ""
            }`}
        >
          {index > 0 && (
            <RxCross2
              onClick={() => removeSection("education", index)}
              className="absolute top-2 right-2 cursor-pointer"
            />
          )}

          <InputField
            label={`${t("degree")}*`}
            type="text"
            name="degree"
            value={edu.degree}
            onChange={(e) => handleChange("educationList", index, "degree", e.target.value)}
            onBlur={() => clearFieldError(`education-${index}-degree`)}
            error={errors[`education-${index}-degree`]}
          />

          <InputField
            label={`${t("passingyear")}*`}
            type="number"
            name="passingyear"
            value={edu.passingyear}
            onChange={(e) => handleChange("educationList", index, "passingyear", e.target.value)}
            onBlur={() => clearFieldError(`education-${index}-passingyear`)}
            error={errors[`education-${index}-passingyear`]}
          />

          {/* <InputField
            label={`${t("schoolname")}`}
            type="text"
            name="schoolname"
            value={edu.schoolname}
            onChange={(e) => handleChange("educationList", index, "schoolname", e.target.value)}
            onBlur={() => clearFieldError(`education-${index}-schoolname`)}
            error={errors[`education-${index}-schoolname`]}
          /> */}

          <InputField
            label={`${t("board")}*`}
            type="text"
            name="board"
            value={edu.board}
            onChange={(e) => handleChange("educationList", index, "board", e.target.value)}
            onBlur={() => clearFieldError(`education-${index}-board`)}
            error={errors[`education-${index}-board`]}
          />
        </div>
      ))}
    </div>
  );
};

export default EducationSection;
