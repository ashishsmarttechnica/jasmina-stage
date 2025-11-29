import Selecter from "@/common/Selecter";
import { languageOptions } from "@/utils/languageOptions";
import { useTranslations } from "next-intl";
import { FiPlusSquare } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const LanguagesSection = ({
  languagesList,
  proficiencyOptions,
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
        <div className="text-[15px] font-medium text-[#0f0f0f]">{t("languages")}</div>
        <FiPlusSquare
          onClick={() => addSection("languages")}
          className="h-[19px] w-[19px] cursor-pointer"
        />
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
              onClick={() => removeSection("languages", index)}
              className="absolute top-2 right-2 cursor-pointer"
            />
          )}

          <div className="space-y-1">
            <label className="text-grayBlueText text-[14px]">{`${t("languagesList")}`}</label>
            <Selecter
              name="languages"
              options={languageOptions}
              value={language.languages}
              onChange={(e) => {
                handleChange("languagesList", index, "languages", e.target.value);
                clearFieldError(`language-${index}-languages`);
              }}
              isSearchable={true}
              isOther={true}
              placeholder="Select a language"
            />
            {/* {errors[`language-${index}-languages`] && (
              <p className="text-[12px] text-red-500">{errors[`language-${index}-languages`]}</p>
            )} */}
          </div>

          <div className="space-y-1">
            <label className="text-grayBlueText text-[14px]">{`${t("proficiency")}`}</label>
            <Selecter
              name="proficiency"
              options={proficiencyOptions}
              value={language.proficiency}
              onChange={(e) =>
                handleChange(
                  "languagesList",
                  index,
                  "proficiency",
                  e.target.value,
                  true,
                  "language"
                )
              }
            />
            {/* {errors[`language-${index}-proficiency`] && (
                  <p className="text-[12px] text-red-500">{errors[`language-${index}-proficiency`]}</p>
                )} */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LanguagesSection;
