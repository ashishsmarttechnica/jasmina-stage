"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import galleryIcon from "@/assets/gallery.png";

const WhoCanSeeYourProfileForm = ({ formData, setFormData }) => {
  const t = useTranslations("UserProfile.whocanseeyourprofile");
  // Handlers
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, publicViewOption: Number(e.target.value) }));
  };

  return (
    <div className="max-w-xl rounded-xl">
      <p className="mb-2 py-1 text-lg font-semibold text-gray-800">{t("Whocanseeyourprofile")}</p>
      {/* Make profile public */}
      <div className="mx-auto mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-1 text-[24px]">🌍</span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-black mb-1 block text-[14px]">{t("Makemyprofilepublic")}</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {t("makePublicModalDescription")}
            </p>
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center self-end sm:self-auto">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={formData.isPublic}
            onChange={() =>
              handleCheckboxChange({ target: { name: "isPublic", checked: !formData.isPublic } })
            }
            name="isPublic"
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-green-600 peer-focus:outline-none after:absolute after:h-6 after:w-6 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
        </label>
      </div>
      {/* Public View Options */}
      {formData.isPublic && (
        <div className="mb-6 px-2 sm:px-9">
          <p className="mb-2 text-sm font-medium text-gray-700">{t("visibleTo")} :</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-grayBlueText">
              <input
                type="radio"
                name="publicViewOption"
                value={0}
                checked={formData.publicViewOption === 0}
                onChange={handleRadioChange}
                className="accent-green-600"
              />
              {t("otheruser")}
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-grayBlueText">
              <input
                type="radio"
                name="publicViewOption"
                value={1}
                checked={formData.publicViewOption === 1}
                onChange={handleRadioChange}
                className="accent-green-600"
              />
              {t("Companies")}
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-grayBlueText">
              <input
                type="radio"
                name="publicViewOption"
                value={2}
                checked={formData.publicViewOption === 2}
                onChange={handleRadioChange}
                className="accent-green-600 "
              />
              {t("Both")}
            </label>
          </div>
        </div>
      )}
      {/* Only LGBTQ Friendly Companies */}
      <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-1 text-[24px]">
            <Image src={galleryIcon} alt="LGBTQ friendly" width={22} height={22} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-black mb-1 block text-[14px]">{t("onlyLgbtqTitle")}</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {t("onlyLgbtqDescription")}
            </p>
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center self-end sm:self-auto">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={formData.isLGBTQFriendly}
            onChange={() =>
              handleCheckboxChange({
                target: { name: "isLGBTQFriendly", checked: !formData.isLGBTQFriendly },
              })
            }
            name="isLGBTQFriendly"
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-green-600 peer-focus:outline-none after:absolute after:h-6 after:w-6 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
        </label>
      </div>
    </div>
  );
};

export default WhoCanSeeYourProfileForm;
