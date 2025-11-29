import InputField from "@/common/InputField";
import Selecter from "@/common/Selecter";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const SkillsForm = forwardRef(({ initialData, errors = {}, clearFieldError }, ref) => {
  const [skillsList, setSkillsList] = useState(
    initialData || [{ name: "", proficiencyLevel: "", yearsOfExperience: "", category: "" }]
  );
  const t = useTranslations("UserProfile.education");

  const proficiencyOptions = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
    { label: "Expert", value: "expert" },
  ];

  useEffect(() => {
    setSkillsList(
      initialData && initialData.length > 0
        ? initialData
        : [{ name: "", proficiencyLevel: "", yearsOfExperience: "", category: "" }]
    );
  }, [initialData]);

  useImperativeHandle(ref, () => ({
    getData: () => skillsList,
  }));

  const handleChange = (index, key, value) => {
    const updatedList = skillsList.map((skill, i) =>
      i === index ? { ...skill, [key]: value } : skill
    );
    setSkillsList(updatedList);
    if (clearFieldError) clearFieldError(`skill-${index}-${key}`);
  };

  const addSection = () => {
    const updatedList = [
      ...skillsList,
      { name: "", proficiencyLevel: "", yearsOfExperience: "", category: "" },
    ];
    setSkillsList(updatedList);
  };

  const removeSection = (index) => {
    const updatedList = skillsList.filter((_, i) => i !== index);
    setSkillsList(updatedList);
  };

  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <p className="text-[15px] font-semibold text-[#0f0f0f]">{`${t("skills")}*`}</p>
        <FiPlusSquare onClick={addSection} className="h-[19px] w-[19px] cursor-pointer" />
      </div>
      {skillsList.map((skill, index) => (
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
              onClick={() => removeSection(index)}
              className="absolute top-2 right-2 cursor-pointer"
            />
          )}

          <InputField
            label={`${t("skillName")} *`}
            name={`skill-${index}`}
            type="text"
            value={skill.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            error={errors[`skill-${index}-name`]}
            placeholder="Enter skill name"
          />
          <div className="space-y-1">
            <label className="text-grayBlueText text-[14px]">{`${t("proficiency")}*`}</label>
            <Selecter
              name="proficiency"
              options={proficiencyOptions}
              value={skill.proficiencyLevel}
              onChange={(e) => handleChange(index, "proficiencyLevel", e.target.value)}
              error={errors[`skill-${index}-proficiencyLevel`]}
            />
          </div>

          <InputField
            label={`${t("experience")}*`}
            name={`yearsOfExperience-${index}`}
            type="number"
            min="0"
            step="0.5"
            value={skill.yearsOfExperience}
            onChange={(e) => handleChange(index, "yearsOfExperience", e.target.value)}
            error={errors[`skill-${index}-yearsOfExperience`]}
            placeholder="Enter years of experience"
          />

          {/* Category */}
          <InputField
            label={`${t("category")}*`}
            name={`category-${index}`}
            type="text"
            value={skill.category}
            onChange={(e) => handleChange(index, "category", e.target.value)}
            error={errors[`skill-${index}-category`]}
            placeholder="Enter category"
          />
        </div>
      ))}
    </div>
  );
});

export default SkillsForm;
