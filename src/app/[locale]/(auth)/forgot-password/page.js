import React from "react";
import ReusableForm from "@/components/form/ReusableForm";
import { getSeoMeta } from "@/lib/seoMetadata";
import { useTranslations } from "next-intl";
import ForgotPasswordForm from "@/components/auth/ForgotPassword/ForgotPasswordForm";

export const metadata = getSeoMeta({
  title: "Jasmina | Login",
  path: "/login",
});

const ForgotPasswordPage = () => {
  const t = useTranslations("auth");

  return (
    <ReusableForm
      title={t("ForgotPasswordTitle")}
      subtitle={t("ForgotPasswordSubTitle")}
    >
      <ForgotPasswordForm />
    </ReusableForm>
  );
};

export default ForgotPasswordPage;
