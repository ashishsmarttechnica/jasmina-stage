import React from "react";
import ReusableForm from "@/components/form/ReusableForm";
import LoginForm from "@/components/auth/LoginForm";
import { getSeoMeta } from "@/lib/seoMetadata";
import { useTranslations } from "next-intl";

export const metadata = getSeoMeta({
  title: "Jasmina | Login",
  path: "/login",
});

const LoginPage = () => {
    const t = useTranslations("auth");

  return (
    <ReusableForm
      title={t("title")}
      subtitle={t("subTitle")}
    >
      <LoginForm />
    </ReusableForm>
  );
};

export default LoginPage;
