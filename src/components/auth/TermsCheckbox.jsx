"use client";
import { getPages } from "@/api/pages.api";
import { Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

const TermsCheckbox = ({ isChecked, setIsChecked, error }) => {
  const t = useTranslations("auth");
  const locale = useLocale();
  const { data: pagesResponse } = useQuery({
    queryKey: ["pages", "legal-links", locale],
    queryFn: () => getPages(locale),
  });

  const pages = Array.isArray(pagesResponse?.data) ? pagesResponse.data : [];
  const findPageByKeywords = (keywords) =>
    pages.find((p) =>
      `${p?.path ?? ""} ${p?.page_title ?? ""} ${p?.information_name ?? ""}`
        .toLowerCase()
        .includes(keywords)
    );

  const privacyPage =
    pages.find((p) =>
      /privacy|policy/i.test(
        `${p?.path ?? ""} ${p?.page_title ?? ""} ${p?.information_name ?? ""}`
      )
    ) || null;
  const termsPage =
    pages.find((p) =>
      /terms|conditions|service/i.test(
        `${p?.path ?? ""} ${p?.page_title ?? ""} ${p?.information_name ?? ""}`
      )
    ) || null;

  const privacyHref = privacyPage
    ? `/pagedetail/${privacyPage.path}`
    : "/pagedetail/privacy-policy";
  const termsHref = termsPage
    ? `/pagedetail/${termsPage.path}`
    : "/pagedetail/terms-conditions";

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          id="default-checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="border-grayBlueText/[50%] focus:ring-primary h-4 w-4 border bg-gray-100 text-blue-600 focus:ring-1"
        />
        <label
          htmlFor="default-checkbox"
          className="text-grayBlueText text-sm text-[13px] leading-[21px] break-words flex flex-wrap"
        >
          {t("BySigning")}
          <Link href={termsHref} className="text-lightBlue mx-1 underline">
            {t("TermsService")}
          </Link>
          {t("and")}
          <Link href={privacyHref} className="text-lightBlue mx-1 underline">
            {t("PrivacyPolicy")}
          </Link>
        </label>
      </div>
      {error && <div className="mt-1 text-[13px] text-red-600">{error}</div>}
    </>
  );
};

export default TermsCheckbox;
