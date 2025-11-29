"use client";
import { useTranslations } from "next-intl";
import InputField from "@/common/InputField";

const EmailStep = ({ email, onEmailChange, onSubmit, errors, isPending }) => {
      const t = useTranslations("auth");
  return (
    <form className="mt-7.5" onSubmit={onSubmit}>
      <InputField
        label={t("forgotPassworFormEmail")}
        name="email"
        type="email"
        value={email}
        onChange={onEmailChange}
        error={errors.email}
        isForgot={true}
      />
      <div className="mt-5 text-center">
        <p className="text-grayBlueText text-[13px] leading-[15px]">{t("forgotLastText")}</p>
      </div>
      <button type="submit" className="btn-fill mt-4" disabled={isPending}>
        {isPending ? "Submitting..." : t("ResetLink")}
      </button>
    </form>
  );
};

export default EmailStep;
