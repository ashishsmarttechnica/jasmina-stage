"use client";
import ReusableForm from "@/components/form/ReusableForm";
import useUpdateProfile from "@/hooks/user/useUpdateProfile";
import { useRouter, usePathname } from "@/i18n/navigation";
import useAuthStore from "@/store/auth.store";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";
import galleryIcon from "@/assets/gallery.png";

const WhoCanSeeYourProfile = ({ onBack }) => {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: updateProfile, isPending, error: apiError } = useUpdateProfile();
  const t = useTranslations("UserProfile.whocanseeyourprofile");

  const [formData, setFormData] = useState({
    isPublic: true,
    isLGBTQFriendly: false,
    publicViewOption: 0,
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    const submitData = new FormData();
    submitData.append("visibility.isPublic", formData.isPublic);
    submitData.append("visibility.onlyLGBTQFriendlyCompanies", formData.isLGBTQFriendly);
    if (formData.isPublic) {
      submitData.append("visibility.visibleTo", formData.publicViewOption);
    } else {
      submitData.append("visibility.visibleTo", "");
    }
    submitData.append("profileComplete", true);

    updateProfile(submitData, {
      onSuccess: (res) => {
        if (res.success) {
          Cookies.set("profileCreated", true);
          // Force page reload when navigating to feed after completing profile steps
          if (typeof window !== "undefined") {
            // Get current locale from pathname (e.g., /en/... or /...)
            const currentPath = window.location.pathname;
            const locale = currentPath.split("/")[1] || "en";
            // Construct full path with locale
            window.location.href = `/${locale}/feed`;
          } else {
            router.push("/feed");
          }
        }
      },
    });
  };

  useEffect(() => {
    if (user?.visibility) {
      setFormData((prev) => ({
        ...prev,
        isPublic: user?.visibility?.isPublic || false,
        isLGBTQFriendly: user?.visibility?.onlyLGBTQFriendlyCompanies || false,
        publicViewOption: user?.visibility?.visibleTo || 0,
      }));
    }
  }, [user]);

  return (
    <div>
      <div className="mt-6 sm:mt-10">
        <ReusableForm
          title={t("Whocanseeyourprofile")}
          subtitle={t("Chooseyourprofilevisibilityandsafetypreferences")}
        >
          {/* Toggle - Make profile public */}
          <div className="mt-2 mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex w-full items-start gap-2 sm:w-auto sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[20px]">🌍</span>
                  <p className="text-sm font-semibold">{t("Makemyprofilepublic")}</p>
                </div>
                <p className="pr-4 pl-7 text-xs text-gray-500 sm:pr-0 sm:pl-8">
                  {t("makePublicDescription")}
                </p>
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center self-end sm:self-auto">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formData.isPublic}
                onChange={() => updateField("isPublic", !formData.isPublic)}
              />
              <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-green-600 peer-focus:outline-none after:absolute after:h-6 after:w-6 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* Public View Options */}
          {formData.isPublic && (
            <div className="mb-4 px-4 sm:px-8">
              <p className="mb-2 text-sm font-medium">{t("publicViewLabel")}</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                {[
                  { label: t("otheruser"), value: 0 },
                  { label: t("Companies"), value: 1 },
                  { label: t("Both"), value: 2 },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="publicView"
                      value={option.value}
                      checked={formData.publicViewOption === option.value}
                      onChange={() => updateField("publicViewOption", option.value)}
                      className="accent-green-600"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Toggle - LGBTQ Friendly */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex w-full items-start gap-2 sm:w-auto sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[20px]">
                    <Image src={galleryIcon} alt="LGBTQ friendly" width={22} height={22} />
                  </span>
                  <p className="text-sm font-semibold">{t("lgbtqFriendlyLabels")}</p>
                </div>
                <p className="pr-4 pl-7 text-xs text-gray-500 sm:pr-0 sm:pl-8">
                  {t("lgbtqFriendlyDescription")}
                </p>
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center self-end sm:self-auto">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formData.isLGBTQFriendly}
                onChange={() => updateField("isLGBTQFriendly", !formData.isLGBTQFriendly)}
              />
              <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-green-600 peer-focus:outline-none after:absolute after:h-6 after:w-6 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              {typeof onBack === "function" && (
                <button
                  type="button"
                  className="btn-white-fill"
                  onClick={onBack}
                >
                  {t("Back")} <span className="text-[20px]">&lt;</span>
                </button>
              )}
            </div>
            <div>
              <button onClick={handleSubmit} className="btn-fill cursor-pointer">
                {t("nextButton")}
              </button>
            </div>
          </div>
        </ReusableForm>
      </div>
    </div>
  );
};

export default WhoCanSeeYourProfile;
