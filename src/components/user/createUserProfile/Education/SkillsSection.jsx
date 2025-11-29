import InputField from "@/common/InputField";
import Selecter from "@/common/Selecter";
import { useTranslations } from "next-intl";
import { FiPlusSquare } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const SkillsSection = ({
  skillsList,
  proficiencyOptions,
  categoryOptions,
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
        <div className="text-[15px] font-medium text-[#0f0f0f]">{`${t("skills")}`}</div>
        <FiPlusSquare
          onClick={() => addSection("skills")}
          className="h-[19px] w-[19px] cursor-pointer"
        />
      </div>
      {skillsList.map((skill, index) => (
        <div
          key={index}
          className={`${index > 0 ? "relative border border-[#ddd]" : ""
            } grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 ${index > 0 ? "mt-2 rounded-md p-4" : ""
            }`}
        >
          {index > 0 && (
            <RxCross2
              onClick={() => removeSection("skills", index)}
              className="absolute top-2 right-2 cursor-pointer"
            />
          )}
          {/* skill */}
          <InputField
            label={`${t("skillName")}*`}
            name={`skill-${index}`}
            type="text"
            value={skill.skill}
            onChange={(e) => handleChange("skillsList", index, "skill", e.target.value)}
            onBlur={() => clearFieldError(`skill-${index}-skill`)}
            error={errors[`skill-${index}-skill`]}
          />
          {/* proficiency */}
          <div className="space-y-1">
            <label className="text-grayBlueText text-[14px]">{`${t("proficiency")}*`}</label>
            <Selecter
              name={`proficiency-${index}`}
              options={proficiencyOptions}
              value={skill.proficiency}
              onChange={(e) =>
                handleChange("skillsList", index, "proficiency", e.target.value, true, "skill")
              }
              error={errors[`skill-${index}-proficiency`]}
            />
          </div>
          {/* experience */}
          <InputField
            label={`${t("experience")}`}
            name={`experience-${index}`}
            type="number"
            min="0"
            step="0.5"
            value={skill.experience}
            onChange={(e) => handleChange("skillsList", index, "experience", e.target.value)}
            onBlur={() => clearFieldError(`skill-${index}-experience`)}
          // error={errors[`skill-${index}-experience`]}
          />

          {/* Category */}
          <Selecter
            label={`${t("category")}*`}
            name={`category-${index}`}
            options={categoryOptions}
            value={skill.category}
            onChange={(e) => handleChange("skillsList", index, "category", e.target.value)}
            onBlur={() => clearFieldError(`skill-${index}-category`)}
            error={errors[`skill-${index}-category`]}
            isOther={true}
            isSearchable={true}
          // isMulti={true}
          />
        </div>
      ))}
    </div>
  );
};

export default SkillsSection;
