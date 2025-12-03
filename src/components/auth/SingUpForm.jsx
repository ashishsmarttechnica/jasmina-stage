"use client";
import ButtonLoader from "@/common/ButtonLoader";
import InputField from "@/common/InputField";
import useSignup from "@/hooks/auth/useSignup";
import useSignInValidationForm from "@/hooks/validation/auth/useSingInValidationForm";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PasswordField from "../form/PasswordField";
import AccountTypeSelector from "./AccountTypeSelector";
import GoogleSignInButton from "./GoogleSignInButton";
import TermsCheckbox from "./TermsCheckbox";
const SignUpForm = () => {
  const searchParams = useSearchParams();
  const accountTypeFromQuery = searchParams.get("accountType");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    accountType: "",
  });

  const t = useTranslations("auth");
  const { errors, validateForm, clearFieldError } = useSignInValidationForm();
  const { mutate, isPending } = useSignup();

  useEffect(() => {
    if (accountTypeFromQuery) {
      // Normalize query parameter: "Company" -> "NGO / Company" for display
      const displayValue = accountTypeFromQuery === "Company" ? "NGO / Company" : accountTypeFromQuery;
      setFormData((prev) => ({ ...prev, accountType: displayValue }));
    }
  }, [accountTypeFromQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() !== "") clearFieldError(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    if (!isChecked) {
      toast.warning(t("checkSingUp"));
      return;
    }

    if (!formData.accountType) {
      toast.error(t("PleaseSelectAccountType"));
      return;
    }

    // Normalize account type: "NGO / Company" or "Company" -> "Company"
    const normalizedAccountType = formData.accountType === "NGO / Company" || formData.accountType === "Company" ? "Company" : formData.accountType;
    
    mutate({
      ...formData,
      accountType: normalizedAccountType
    });
  };

  return (
    <form className="mt-7.5" onSubmit={handleSubmit}>
      <InputField
        label={t("EmailAddress")}
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />

      <PasswordField
        label={t("Password")}
        name="password"
        value={formData.password}
        onChange={handleChange}
        show={showPassword}
        toggle={() => setShowPassword(!showPassword)}
        error={errors.password}
        autocomplete="new-password"
      />

      <AccountTypeSelector
        value={formData.accountType}
        onChange={(val) => setFormData((prev) => ({ ...prev, accountType: val }))}
      />

      <TermsCheckbox isChecked={isChecked} setIsChecked={setIsChecked} />

      <div className="mt-3 sm:mt-[40px]">
        <ButtonLoader type="submit" label={t("SignUp")} isPending={isPending} />

        <div className="text-grayBlueText my-[15px] text-center text-base leading-[18px]">
          {t("or")}
        </div>

        <GoogleSignInButton />

        <div className="mt-7.5 text-center">
          <p className="text-grayBlueText text-base leading-[18px]">
            {t("AlreadyHaveAccount")}
            <Link href="/login" className="text-lightBlue cursor-pointer">
              {" "}
              {t("Login")}
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
