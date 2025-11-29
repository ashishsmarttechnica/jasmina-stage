"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const SkillsTab = ({ skills }) => {
  const t = useTranslations("UserProfile.profile.singleprofileTab");
  const [visibleCount, setVisibleCount] = useState(3);
  // Handle empty or missing skills
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return (
      <div className="p-4">
        <div className="px-[30px]">
          <p className="text-gray-500">No data found.</p>
        </div>
      </div>
    );
  }
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  }

  // Slice education data to show only visible count
  const visibleSkill = skills.slice(0, visibleCount);
  const hasMore = visibleCount < skills.length;
  return (
    <div className="p-4">
      <div className="sm:px-[30px]">
        <div className="space-y-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">{t("skills")}</th>
                <th className="text-left p-2 font-medium">{t("experience")}</th>
              </tr>
            </thead>
            <tbody>
              {visibleSkill.map((item, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="p-2">{item.name || "N/A"}</td>
                  <td className="p-2">{item.yearsOfExperience > 0 ? item.yearsOfExperience + " " + t("years") : t("notspecified")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* {visibleSkill.map((skill, index) => (
            <div key={index} className="flex items-baseline gap-2">
              <span className="font-bold text-lg">{skill.name}</span>
              <span className="text-gray-500 text-base">
                {skill.yearsOfExperience} year
              </span>
            </div>
          ))} */}
        </div>
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-primary text-[13px] hover:bg-primary/90 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
            >
              Load More
            </button>
          </div>
        )}
        {/* {!hasMore && skills.length > 0 && (
          <div className="mt-2 text-center text-gray-500">
            <p>No more skills to load.</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SkillsTab;
