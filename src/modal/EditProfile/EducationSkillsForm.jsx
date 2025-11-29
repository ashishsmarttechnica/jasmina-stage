import EducationSection from "@/components/user/createUserProfile/Education/EducationSection";
import ExperienceSection from "@/components/user/createUserProfile/Education/ExperienceSection";
import LanguagesSection from "@/components/user/createUserProfile/Education/LanguagesSection";
import SkillsSection from "@/components/user/createUserProfile/Education/SkillsSection";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const EducationSkillsForm = forwardRef(
  ({ initialData = {}, errors = {}, clearFieldError, categoryOptions = [], proficiencyOptions = [] }, ref) => {
    const [formData, setFormData] = useState({
      educationList: [{ degree: "", passingyear: "", schoolname: "", board: "" }],
      skillsList: [{ skill: "", proficiency: "", experience: "", category: "" }],
      languagesList: [{ languages: "", proficiency: "" }],
      experienceList: [{ companyName: "", role: "", startDate: "", endDate: "", location: "", position: "" }],
    });

    useEffect(() => {
      if (Object.keys(initialData).length) {
        setFormData((prev) => ({
          educationList: initialData.education?.length
            ? initialData.education.map((edu) => ({
              degree: edu.degreeName || "",
              passingyear: edu.passingYear || "",
              schoolname: edu.schoolOrCollege || "",
              board: edu.universityOrBoard || "",
            }))
            : prev.educationList,
          skillsList: initialData.skills?.length
            ? initialData.skills.map((skill) => ({
              skill: skill.name || "",
              proficiency: skill.proficiencyLevel || "",
              experience: skill.yearsOfExperience || "",
              category: skill.category || "",
            }))
            : prev.skillsList,
          languagesList: initialData.languages?.length
            ? initialData.languages.map((lang) => ({
              languages: lang.name || "",
              proficiency: lang.proficiency || "",
            }))
            : prev.languagesList,
          experienceList: initialData.experience?.length
            ? initialData.experience.map((exp) => ({
              companyName: exp.companyName || "",
              role: exp.jobTitle || "",
              startDate: exp.startDate || "",
              endDate: exp.endDate || "",
              location: exp.location || "",
              position: exp.position || "",
            }))
            : prev.experienceList,
        }));
      }
    }, []);

    useImperativeHandle(ref, () => ({
      getData: () => formData,
    }));

    const addSection = (type) => {
      setFormData((prevData) => {
        if (type === "education") {
          return {
            ...prevData,
            educationList: [
              ...prevData.educationList,
              { degree: "", passingyear: "", schoolname: "", board: "" },
            ],
          };
        }
        if (type === "skills") {
          return {
            ...prevData,
            skillsList: [
              ...prevData.skillsList,
              { skill: "", proficiency: "", experience: "", category: "" },
            ],
          };
        }
        if (type === "languages") {
          return {
            ...prevData,
            languagesList: [...prevData.languagesList, { languages: "", proficiency: "" }],
          };
        }
        if (type === "experienceList") {
          return {
            ...prevData,
            experienceList: [
              ...prevData.experienceList,
              { companyName: "", role: "", startDate: "", endDate: "", location: "", position: "" },
            ],
          };
        }
        return prevData;
      });
    };

    const removeSection = (type, index) => {
      setFormData((prevData) => {
        if (type === "education") {
          return {
            ...prevData,
            educationList: prevData.educationList.filter((_, i) => i !== index),
          };
        }
        if (type === "skills") {
          return {
            ...prevData,
            skillsList: prevData.skillsList.filter((_, i) => i !== index),
          };
        }
        if (type === "languages") {
          return {
            ...prevData,
            languagesList: prevData.languagesList.filter((_, i) => i !== index),
          };
        }
        if (type === "experienceList") {
          return {
            ...prevData,
            experienceList: prevData.experienceList.filter((_, i) => i !== index),
          };
        }
        return prevData;
      });
    };

    const handleChange = (type, index, name, value, isSelect = false, selectType) => {
      setFormData((prevData) => {
        const updatedList = [...prevData[type]]; // shallow copy array
        updatedList[index] = { ...updatedList[index], [name]: value }; // shallow copy object at index
        if (isSelect && clearFieldError) {
          clearFieldError(`${selectType}-${index}-${name}`);
        }
        return { ...prevData, [type]: updatedList };
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <EducationSection
            educationList={formData.educationList}
            addSection={addSection}
            removeSection={removeSection}
            handleChange={handleChange}
            errors={errors}
            clearFieldError={clearFieldError}
          />
        </div>
        <div>
          <ExperienceSection
            experienceList={formData.experienceList}
            addSection={addSection}
            removeSection={removeSection}
            handleChange={handleChange}
            errors={errors}
            clearFieldError={clearFieldError}
          />
        </div>
        <div>
          <SkillsSection
            categoryOptions={categoryOptions}
            skillsList={formData.skillsList}
            proficiencyOptions={proficiencyOptions}
            addSection={addSection}
            removeSection={removeSection}
            handleChange={handleChange}
            errors={errors}
            clearFieldError={clearFieldError}
          />
        </div>
        <div>
          <LanguagesSection
            languagesList={formData.languagesList}
            proficiencyOptions={proficiencyOptions}
            addSection={addSection}
            removeSection={removeSection}
            handleChange={handleChange}
            errors={errors}
            clearFieldError={clearFieldError}
          />
        </div>
      </div>
    );
  }
);

export default EducationSkillsForm;
