"use client";
import InputField from "@/common/InputField";
import LocationSelector from "@/common/LocationSelector";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

const CompanyLocationForm = ({ formData, errors, setFormData, handleChange, clearFieldError }) => {
  const t = useTranslations("CompanyProfile.location");

  // console.log(formData.isLGBTQ, "isLGBTQ");

  const handleLocationChange = useCallback(
    (locationString, countryData) => {
      if (locationString) {
        setFormData((prev) => ({
          ...prev,
          country: locationString,
          countryCode: countryData?.countryCode || "",
          // Update isLGBTQ based on country data
          isLGBTQ: countryData?.isLGBTQ || false,
        }));

        clearFieldError("location");
      }
    },
    [clearFieldError, setFormData]
  );

  return (
    <>
      <div className="mb-4 text-center">
        <p className="mt-7 text-[15px] font-medium">{t("title")}</p>
        <p className="text-grayBlueText text-[13px]">{t("subTitle")}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Location Selector Component */}
      </div>
      <div className="space-y-1">
        <LocationSelector
          value={formData.country}
          onChange={handleLocationChange}
          error={errors.country}
          countryLabel={`${t("CountryHeadquarters")} *`}
          isLGBTQ={true}
        />
      </div>

      <InputField
        label={`${t("fullAddress")} *`}
        type="text"
        name="fullAddress"
        value={formData.fullAddress}
        onChange={handleChange}
        error={errors.fullAddress}
      />
    </>
  );
};

export default CompanyLocationForm;
