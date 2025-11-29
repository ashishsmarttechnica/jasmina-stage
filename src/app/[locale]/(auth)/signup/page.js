import React from "react";
import ReusableForm from "@/components/form/ReusableForm";
import { getSeoMeta } from "@/lib/seoMetadata";
import SingUpForm from "@/components/auth/SingUpForm";
import { useTranslations } from "next-intl";

export const metadata = getSeoMeta({
  title: "Jasmina | Sign up",
  path: "/signup",
});

const SignupPage = () => {
  const t = useTranslations("auth");

  return (
    <ReusableForm title={t("SingUpTitle")} subtitle={t("SingUpSubtitle")}>
      <SingUpForm />
    </ReusableForm>
  );
};

export default SignupPage;
