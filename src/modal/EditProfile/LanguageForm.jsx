import Selecter from "@/common/Selecter";
import { languageOptions } from "@/utils/languageOptions";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const LanguageForm = forwardRef(({ initialData, errors = {}, clearFieldError }, ref) => {
  const [languagesList, setLanguagesList] = useState(
    initialData || [{ name: "", proficiency: "" }]
  );
  const t = useTranslations("UserProfile.education");

  const proficiencyOptions = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
    { label: "Expert", value: "expert" },
  ];

  useEffect(() => {
    setLanguagesList(
      initialData && initialData.length > 0 ? initialData : [{ name: "", proficiency: "" }]
    );
  }, [initialData]);

  useImperativeHandle(ref, () => ({
    getData: () => languagesList,
  }));

  const handleChange = (index, key, value) => {
    const updatedList = languagesList.map((lang, i) =>
      i === index ? { ...lang, [key]: value } : lang
    );
    setLanguagesList(updatedList);
    if (clearFieldError) clearFieldError(`language-${index}-${key}`);
  };

  const addSection = () => {
    const updatedList = [...languagesList, { name: "", proficiency: "" }];
    setLanguagesList(updatedList);
  };

  const removeSection = (index) => {
    const updatedList = languagesList.filter((_, i) => i !== index);
    setLanguagesList(updatedList);
  };

  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <p className="text-[15px] font-medium text-[#0f0f0f]">{t("languages")}</p>
        <FiPlusSquare onClick={addSection} className="h-[19px] w-[19px] cursor-pointer" />
      </div>
      {languagesList.map((language, index) => (
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

          <div className="space-y-1">
            <label className="text-grayBlueText text-[14px]">{`${t("languagesList")}*`}</label>
            <Selecter
              name="language"
              options={languageOptions}
              value={language.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              error={errors[`language-${index}-name`]}
              isSearchable={true}
              isOther={true}
              placeholder="Select a language"
            />
            {errors[`language-${index}-name`] && (
              <p className="text-[12px] text-red-500">{errors[`language-${index}-name`]}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-grayBlueText text-[14px]">{`${t("proficiency")}*`}</label>
            <Selecter
              name="proficiency"
              options={proficiencyOptions}
              value={language.proficiency}
              onChange={(e) => handleChange(index, "proficiency", e.target.value)}
              error={errors[`language-${index}-proficiency`]}
            />
            {errors[`language-${index}-proficiency`] && (
              <p className="text-[12px] text-red-500">{errors[`language-${index}-proficiency`]}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default LanguageForm;
