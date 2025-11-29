import ReusableForm from "@/components/form/ReusableForm";
import useUpdateProfile from "@/hooks/user/useUpdateProfile";
import useEducationSkillsForm from "@/hooks/validation/user/useEducationSkillsForm";
import useAuthStore from "@/store/auth.store";
import { useProficiencyOptions, useSkillCategoryOptions } from "@/utils/selectOptions";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Loader } from "rsuite";
import EducationSection from "./Education/EducationSection";
import ExperienceSection from "./Education/ExperienceSection";
import LanguagesSection from "./Education/LanguagesSection";
import SkillsSection from "./Education/SkillsSection";

const EducationSkills = ({ setActiveTab, activeTab }) => {
  const { user, setUser } = useAuthStore();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const t = useTranslations("UserProfile.education");

  const proficiencyOptions = useProficiencyOptions();
  const skillCategoryOptions = useSkillCategoryOptions();

  const [formData, setFormData] = useState({
    educationList: [{ degree: "", passingyear: "", schoolname: "", board: "" }],
    skillsList: [{ skill: "", proficiency: "", experience: "", category: "" }],
    languagesList: [{ languages: "", proficiency: "" }],
    experienceList: [{ companyName: "", role: "", startDate: "", endDate: "", location: "", position: "" }],
  });

  const { errors, validateForm, clearFieldError } = useEducationSkillsForm();

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
      const updatedList = [...prevData[type]];
      updatedList[index] = { ...updatedList[index], [name]: value };

      if (isSelect) {
        clearFieldError(`${selectType}-${index}-${name}`);
      }

      return { ...prevData, [type]: updatedList };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    const submitData = new FormData();
    formData.educationList.forEach((edu, index) => {
      submitData.append(`education[${index}][degreeName]`, edu.degree);
      submitData.append(`education[${index}][passingYear]`, edu.passingyear);
      submitData.append(`education[${index}][schoolOrCollege]`, edu.schoolname);
      submitData.append(`education[${index}][universityOrBoard]`, edu.board);
    });

    formData.skillsList.forEach((skill, index) => {
      submitData.append(`skills[${index}][name]`, skill.skill);
      submitData.append(`skills[${index}][proficiencyLevel]`, skill.proficiency);
      submitData.append(`skills[${index}][yearsOfExperience]`, skill.experience);
      submitData.append(`skills[${index}][category]`, skill.category);
    });

    formData.languagesList.forEach((lang, index) => {
      submitData.append(`languages[${index}][name]`, lang.languages);
      submitData.append(`languages[${index}][proficiency]`, lang.proficiency);
    });

    formData.experienceList.forEach((exp, index) => {
      submitData.append(`experience[${index}][companyName]`, exp.companyName);
      submitData.append(`experience[${index}][jobTitle]`, exp.role);
      submitData.append(`experience[${index}][startDate]`, exp.startDate);
      submitData.append(`experience[${index}][endDate]`, exp.endDate);
      submitData.append(`experience[${index}][location]`, exp.location);
      submitData.append(`experience[${index}][position]`, exp.position);
    });

    submitData.append("steps", activeTab + 1);

    updateProfile(submitData, {
      onSuccess: (res) => {
        if (res.success) {
         setActiveTab(activeTab + 1);
        }
      },
    });
  };

  useEffect(() => {
    if (user) {
      const { education, skills, languages, experience } = user;
      setFormData((prev) => ({
        ...prev,
        educationList:
          education?.length > 0
            ? education.map((edu) => ({
              degree: edu.degreeName || "",
              passingyear: edu.passingYear || "",
              schoolname: edu.schoolOrCollege || "",
              board: edu.universityOrBoard || "",
            }))
            : [{ degree: "", passingyear: "", schoolname: "", board: "" }],

        skillsList:
          skills?.length > 0
            ? skills.map((skill) => ({
              skill: skill.name || "",
              proficiency: skill.proficiencyLevel || "",
              experience: skill.yearsOfExperience || "",
              category: skill.category || "",
            }))
            : [{ skill: "", proficiency: "", experience: "", category: "" }],

        languagesList:
          languages?.length > 0
            ? languages.map((lang) => ({
              languages: lang.name || "",
              proficiency: lang.proficiency || "",
            }))
            : [{ languages: "", proficiency: "" }],

        experienceList:
          experience?.length > 0
            ? experience.map((exp) => ({
              companyName: exp.companyName || "",
              role: exp.jobTitle || "",
              startDate: exp.startDate || "",
              endDate: exp.endDate || "",
              location: exp.location || "",
              position: exp.position || "",
            }))
            : [{ companyName: "", role: "", startDate: "", endDate: "", location: "", position: "" }],
      }));
    }
  }, [user]);

  return (
    <ReusableForm title={t("title")} maxWidth="max-w-[698px]" subtitle={t("subTitle")}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Education Section */}
        <EducationSection
          educationList={formData.educationList}
          addSection={addSection}
          removeSection={removeSection}
          handleChange={handleChange}
          errors={errors}
          clearFieldError={clearFieldError}
        />

        {/* Experience Section */}
        <ExperienceSection
          experienceList={formData.experienceList}
          addSection={addSection}
          removeSection={removeSection}
          handleChange={handleChange}
          errors={errors}
          clearFieldError={clearFieldError}
        />

        {/* Skills Section */}
        <SkillsSection
          categoryOptions={skillCategoryOptions}
          skillsList={formData.skillsList}
          proficiencyOptions={proficiencyOptions}
          addSection={addSection}
          removeSection={removeSection}
          handleChange={handleChange}
          errors={errors}
          clearFieldError={clearFieldError}
        />

        {/* Languages Section */}
        <LanguagesSection
          languagesList={formData.languagesList}
          proficiencyOptions={proficiencyOptions}
          addSection={addSection}
          removeSection={removeSection}
          handleChange={handleChange}
          errors={errors}
          clearFieldError={clearFieldError}
        />

        <div className="mt-6 sm:mt-8">
          <div className="grid grid-cols-2 gap-4">
            {activeTab > 0 && (
              <button
                type="button"
                className="btn-white-fill"
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={isPending}
              >
                {t("Back")} <span className="text-[20px]">&lt;</span>
              </button>
            )}

            <button className={`btn-fill ${activeTab > 0 ? "" : "col-span-2"}`} type="submit">
              {isPending ? (
                <div>
                  <Loader inverse />
                </div>
              ) : (
                `${t("Next")} >`
              )}
            </button>
          </div>
        </div>
      </form>
    </ReusableForm>
  );
};

export default EducationSkills;
