"use client";

import { useTranslations } from "next-intl";

const AboutTab = ({ userData }) => {
  const t = useTranslations("CompanyProfile");
  return (
    <div className="p-2 sm:p-6">
      <div className="px-[30px]">
        <div className="space-y-2">
          <h3 className="text-grayBlueText text-[13px] font-normal">{userData?.description}</h3>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="max-w-[10px] text-[13px] font-medium">{t("Website")}</p>
              <a
                href={userData?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block max-w-[250px] truncate text-[13px] text-blue-500 hover:underline"
              >
                {userData?.website || t("NotSpecified")}
              </a>
            </div>
            <div>
              <p className="text-[13px] font-medium">{t("Phone")}</p>
              <span className="text-[13px] text-blue-500">
                {userData?.phoneNumber || t("NotSpecified")}
              </span>
            </div>
            {userData?.socialLinks && (
              <div>
                <p className="text-[13px] font-medium">{t("LinkedInSocialLinks")}</p>
                <a
                  href={userData?.socialLinks}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] block max-w-[250px] truncate  text-blue-500 hover:underline"
                >
                  {userData?.socialLinks || t("NotSpecified")}
                </a>
              </div>
            )}
            {userData?.instagram && (
              <div>
                <p className="text-[13px] font-medium">{t("Instagram")}</p>
                <a
                  href={userData?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-blue-500 hover:underline"
                >
                  {userData?.instagram || t("NotSpecified")}
                </a>
              </div>
            )}
            {userData?.facebook && (
              <div>
                <p className="text-[13px] font-medium">{t("Facebook")}</p>
                <a
                  href={userData?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-blue-500 hover:underline"
                >
                  {userData?.facebook || t("NotSpecified")}
                </a>
              </div>
            )}
            {userData?.x && (
              <div>
                <p className="text-[13px] font-medium">{t("X")}</p>
                <a
                  href={userData?.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-blue-500 hover:underline"
                >
                  {userData?.x || t("NotSpecified")}
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <p className="text-[13px] font-medium">{t("Founded")}</p>
              <span className="text-grayBlueText text-[13px]">
                {userData?.industry || t("NotSpecified")}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-medium">{t("Industry")}</p>
              <div className="flex flex-wrap gap-2">
                {userData?.industryType?.map((industry, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 border-primary text-primary rounded border px-2 text-[12px]"
                  >
                    {industry}
                  </span>
                )) || <span className="text-grayBlueText text-[13px]">{t("Notspecified")}</span>}
              </div>
            </div>
            <div>
              <p className="text-[13px] font-medium">{t("Employees")}</p>
              <span className="text-grayBlueText text-[13px]">
                {userData?.numberOfEmployees || t("NotSpecified")}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-medium">{t("Headquarters")}</p>
              <span className="text-grayBlueText text-[13px]">
                {userData?.fullAddress || t("NotSpecified")}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-medium">{t("CompanyType")}</p>
              <span className="text-grayBlueText text-[13px]">
                {userData?.companyType || t("NotSpecified")}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-medium">{t("Phone")}</p>
              <span className="text-grayBlueText text-[13px]">
                {userData?.contact || t("NotSpecified")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
