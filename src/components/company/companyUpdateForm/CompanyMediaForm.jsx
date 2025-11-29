import ImageUploader1 from "@/common/ImageUploader1";
import InputField from "@/common/InputField";
import getImg from "@/lib/getImg";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const CompanyMediaForm = ({
  formData,
  errors,
  handleChange,
  selectedImage,
  setSelectedImage,
  setSelectedBannerImageFile,
}) => {
  const t = useTranslations("CompanyProfile.media");

  useEffect(() => {
    if (formData.coverBannerUrl) {
      setSelectedImage(getImg(formData.coverBannerUrl));
    }
  }, [formData.logoUrl]);
  return (
    <>
      <div className="mb-4 text-center">
        <p className="mt-7 text-[15px] font-medium">{t("title")}</p>
        <p className="text-grayBlueText text-[13px]">{t("subTitle")}</p>
      </div>
      <InputField
        label={`${t("tagline")}`}
        type="text"
        name="tagline"
        value={formData.tagline}
        onChange={handleChange}
        // error={errors.tagline}
      />
      <InputField
        label={`${t("description")} *`}
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        textarea
        rows={4}
      />

      <InputField
        label={t("socialLinks")}
        type="url"
        placeholder="https://example.com"
        name="socialLinks"
        value={formData.socialLinks}
        onChange={handleChange}
        error={errors.socialLinks}
      />
      <InputField
        label={t("instagramLink") || "Instagram Link"}
        type="url"
        placeholder="https://example.com"
        name="instagramLink"
        value={formData.instagramLink}
        onChange={handleChange}
        error={errors.instagramLink}
      />
      <InputField
        label={t("twitterLink") || "X Link"}
        type="url"
        placeholder="https://example.com"
        name="twitterLink"
        value={formData.twitterLink}
        onChange={handleChange}
        error={errors.twitterLink}
      />
      <InputField
        label={t("facebookLink") || "Facebook Link"}
        type="url"
        placeholder="https://example.com"
        name="facebookLink"
        value={formData.facebookLink}
        onChange={handleChange}
        error={errors.facebookLink}
      />

      <div >
        <p className="mb-1 text-sm text-gray-500">{t("uploadImage")}</p>
        <ImageUploader1
          isBanner={false}
          isnotCEntered={true}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setSelectedImageFile={setSelectedBannerImageFile}
          priority={true}
          enableCropping={true}
          aspectRatio={0}
          isRounded={false}
          width={660}
          height={200}
        />
      </div>
    </>
  );
};

export default CompanyMediaForm;
