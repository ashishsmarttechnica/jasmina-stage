"use client";
import { useTranslations } from "next-intl";

const PreferencesTab = ({ preferences }) => {
    const t = useTranslations("UserProfile.profile.singleprofileTab");
    console.log(preferences, "preferences======");
    // Helper to determine if a single value is meaningfully present
    const isValuePresent = (value) => {
        if (typeof value === "object") return Object.keys(value).length > 0;
        return true; // numbers, booleans
    };

    // Handle missing or empty preferences object
    const hasAnyPreferenceData =
        preferences && typeof preferences === "object"
            ? Object.values(preferences).some(isValuePresent)
            : false;

    if (!hasAnyPreferenceData) {
        return (
            <div className="p-4">
                <div className="px-[30px]">
                    <p className="text-gray-500">{t("Nodatafound")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="px-[30px] sm: space-y-3 text-sm text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2  space-y-3 ">

                    <div>
                        <h3 className="font-semibold">{t("jobrole")}</h3>
                        <p>{preferences.jobRole || "N/A"}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold">{t("PreferredIndustry")}</h3>
                        <p>{preferences.preferredIndustry || "N/A"}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 space-y-3 ">
                    <div>
                        <h3 className="font-semibold">{t("PreferredLocation")}</h3>
                        <p>{preferences.preferredLocation || "N/A"}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold">{t("jobtype")}</h3>
                        <p>{Array.isArray(preferences.jobType) ? preferences.jobType.join(", ") : "N/A"}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 space-y-3">
                    <div>
                        <h3 className="font-semibold">{t("ExpectedSalary")}</h3>
                        <p>
                            {preferences.expectedSalaryRange
                                ? `${preferences.expectedSalaryRange} ${preferences.currency || ""}`
                                : "N/A"}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">{t("YearsofExperience")}</h3>
                        <p>{preferences.yearsOfExperience ?? "N/A"}</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold">{t("availablefrom")}</h3>
                    <p>{preferences.availableFrom ? preferences.availableFrom.split('T')[0] : "Not specified"}</p>
                </div>
            </div>
        </div>
    );
};

export default PreferencesTab;
