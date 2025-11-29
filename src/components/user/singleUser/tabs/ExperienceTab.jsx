
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { formatDateRangeWithDuration } from "../../../../utils/dateUtils";

const ExperienceTab = ({ experience }) => {
  const t = useTranslations("UserProfile.profile.singleprofileTab");
  const [visibleCount, setVisibleCount] = useState(3);
  // Filter out empty placeholder items and handle empty or missing experience data early
  const isExperienceItemValid = (item) => {
    if (!item || typeof item !== "object") return false;
    const textFields = [item.companyName, item.position, item.jobTitle, item.location];
    const hasText = textFields.some((v) => typeof v === "string" && v.trim().length > 0);
    const hasDates = Boolean(item.startDate) || Boolean(item.endDate);
    return hasText || hasDates;
  };

  const validExperiences = Array.isArray(experience) ? experience.filter(isExperienceItemValid) : [];

  if (validExperiences.length === 0) {
    return (
      <div className="p-4">
        <div className="px-[30px]">
          <p className="text-gray-500">{t("noexperience")}</p>
        </div>
      </div>
    );
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleExperiences = validExperiences.slice(0, visibleCount);
  const hasMore = visibleCount < validExperiences.length;

  return (
    <div className="p-4">
      <div className="sm:px-[30px] space-y-2 text-sm text-gray-700">


        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium">{t("companyName")}</th>
              <th className="text-left p-2 font-medium">{t("position")}</th>
              <th className="text-left p-2 font-medium">{t("experience")}</th>
            </tr>
          </thead>
          <tbody>
            {visibleExperiences.map((item, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="p-2">{item.companyName || "N/A"}</td>
                <td className="p-2">{item.position || "N/A"}</td>
                <td className="p-2 text-sm text-gray-500">
                  {item.startDate && item.endDate
                    ? formatDateRangeWithDuration(item.startDate, item.endDate)
                    : item.startDate
                    ? `${new Date(item.startDate).toLocaleDateString()} - Till Now`
                    : item.endDate
                    ? new Date(item.endDate).toLocaleDateString()
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* {visibleExperiences.map((item, index) => (
          <div key={index} className="space-y-3 border-b pb-2 last:border-b-0">
            <div className="grid grid-cols-3 ">
              <div>
                <h3 className="font-medium">Company Name</h3>
                <p>{item.companyName || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium">Position</h3>
                <p>{item.position || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium">Total experience</h3>
                <p className="text-sm text-gray-500">
                  {item.startDate && item.endDate
                    ? formatDateRangeWithDuration(item.startDate, item.endDate)
                    : ""}
                </p>
              </div>
            </div>
          </div>
        ))} */}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="bg-primary text-[13px] hover:bg-primary/90 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
          >
            {t("loadmore")}
          </button>
        </div>
      )}

      {/* No More Experiences Message */}
      {/* {!hasMore && experience.length > 0 && (
          <div className="mt-2 text-center text-gray-500">
            <p>{t("noexperience")}</p>
          </div>
        )} */}
    </div>
  );
};

export default ExperienceTab;
