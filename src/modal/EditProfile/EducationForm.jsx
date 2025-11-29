import InputField from "@/common/InputField";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const EducationForm = forwardRef(({ initialData, errors = {}, clearFieldError }, ref) => {
  const [educationList, setEducationList] = useState(
    initialData || [{ degreeName: "", passingYear: "", schoolOrCollege: "", universityOrBoard: "" }]
  );
  const t = useTranslations("UserProfile.education");

  useEffect(() => {
    setEducationList(
      initialData && initialData.length > 0
        ? initialData
        : [{ degreeName: "", passingYear: "", schoolOrCollege: "", universityOrBoard: "" }]
    );
  }, [initialData]);

  useImperativeHandle(ref, () => ({
    getData: () => educationList,
  }));

  const handleChange = (index, key, value) => {
    const updatedList = educationList.map((edu, i) =>
      i === index ? { ...edu, [key]: value } : edu
    );
    setEducationList(updatedList);
    if (clearFieldError) clearFieldError(`education-${index}-${key}`);
  };

  const addSection = () => {
    const updatedList = [
      ...educationList,
      { degreeName: "", passingYear: "", schoolOrCollege: "", universityOrBoard: "" },
    ];
    setEducationList(updatedList);
  };

  const removeSection = (index) => {
    const updatedList = educationList.filter((_, i) => i !== index);
    setEducationList(updatedList);
  };

  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <p className="text-[15px] font-medium text-[#0f0f0f]">{t("educationSection")}</p>
        <FiPlusSquare onClick={addSection} className="h-[19px] w-[19px] cursor-pointer" />
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
              onClick={() => removeSection(index)}
              className="absolute top-2 right-2 cursor-pointer"
            />
          )}

          <InputField
            label={`${t("degree")}*`}
            type="text"
            name="degreeName"
            value={edu.degreeName}
            onChange={(e) => handleChange(index, "degreeName", e.target.value)}
            error={errors[`education-${index}-degreeName`]}
            placeholder="Enter degree name"
          />

          <InputField
            label={`${t("passingyear")}*`}
            type="number"
            name="passingYear"
            value={edu.passingYear}
            onChange={(e) => handleChange(index, "passingYear", e.target.value)}
            error={errors[`education-${index}-passingYear`]}
            placeholder="Enter passing year"
          />

          <InputField
            label={`${t("schoolname")}*`}
            type="text"
            name="schoolOrCollege"
            value={edu.schoolOrCollege}
            onChange={(e) => handleChange(index, "schoolOrCollege", e.target.value)}
            error={errors[`education-${index}-schoolOrCollege`]}
            placeholder="Enter school/college"
          />

          <InputField
            label={`${t("board")}*`}
            type="text"
            name="universityOrBoard"
            value={edu.universityOrBoard}
            onChange={(e) => handleChange(index, "universityOrBoard", e.target.value)}
            error={errors[`education-${index}-universityOrBoard`]}
            placeholder="Enter university/board"
          />
        </div>
      ))}
    </div>
  );
});

export default EducationForm;
