import { useTranslations } from "next-intl";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

const SkillsInput = ({ onSkillsChange, initialSkills = [], placeholder = "" }) => {
  const t = useTranslations("CreateJobForm");
  const [skills, setSkills] = useState(initialSkills);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill) {
      // Check for duplicate skill (case insensitive)
      if (skills.some((skill) => skill.toLowerCase() === trimmedSkill.toLowerCase())) {
        setError(t("skillsStep.duplicateError"));
        return;
      }
      const newSkills = [...skills, trimmedSkill];
      setSkills(newSkills);
      setSkillInput("");
      setError("");
      onSkillsChange(newSkills);
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(newSkills);
    onSkillsChange(newSkills);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => {
              setSkillInput(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t("skillsStep.skillPlaceholder")}
            className="border-lightGray/75 focus:ring-primary hover:border-primary hover:bg-primary/5 active:bg-primary/10 w-full rounded border p-2 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-1 focus:outline-none"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <button type="button" onClick={handleAddSkill} className="btn-small h-[42px]">
          {t("skillsStep.addButton")}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="group border-primary/10 hover:border-primary/30 hover:bg-primary/5 flex items-center gap-2 rounded-md border bg-white px-3 py-1.5 shadow-sm transition-all duration-200"
          >
            <span className="text-primary/80 text-sm font-medium">{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="bg-primary/10 text-primary/60 hover:bg-primary/20 hover:text-primary group-hover:bg-primary/20 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200"
            >
              <IoCloseOutline className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsInput;
