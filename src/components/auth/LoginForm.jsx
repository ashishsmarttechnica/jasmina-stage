"use client";
import ButtonLoader from "@/common/ButtonLoader";
import InputField from "@/common/InputField";
import useLogin from "@/hooks/auth/useLogin";
import useSignInValidationForm from "@/hooks/validation/auth/useSingInValidationForm";
import { Link } from "@/i18n/navigation";
import { getChatSocket } from "@/utils/socket";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import PasswordField from "../form/PasswordField";
import GoogleLoginButton from "./GoogleLoginButton";
import { useSearchParams } from "next/navigation";

const LoginForm = () => {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect") || "";
  const redirectPath = useMemo(() => {
    if (!redirectParam || typeof redirectParam !== "string") return null;
    return redirectParam.startsWith("/") ? redirectParam : null;
  }, [redirectParam]);

  const { errors, validateForm, clearFieldError } = useSignInValidationForm();
  const { mutate, isPending, error } = useLogin({ redirectPath });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() !== "") clearFieldError(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    // Handle actual sign in
    mutate(formData, {
      onSuccess: (data) => {
        try {
          if (data?.success && data?.data?._id) {
            const socket = getChatSocket(data.data._id);
            socket?.connect?.();
          }
        } catch (err) {
          // swallow socket init errors to not block login flow
          console.error("Socket init after login failed", err);
        }
      },
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
        autocomplete="current-password"
      />

      <div className="flex items-center">
        <Link href="/forgot-password" className="text-primary mx-1 text-base leading-[18px]">
          {t("ForgotPassword")}
        </Link>
      </div>

      <div className="mt-3 sm:mt-[43px]">
        <ButtonLoader type="submit" label={t("Signin")} isPending={isPending} />

        <div className="text-grayBlueText my-[15px] text-center text-base leading-[18px]">
          {t("or")}
        </div>

        <GoogleLoginButton redirectPath={redirectPath} />

        <div className="mt-7.5 text-center">
          <p className="text-grayBlueText text-base leading-[18px]">
            {t("NewJasmina")}
            <Link href="/signup" className="text-lightBlue cursor-pointer">
              {" "}
              {t("CreateAccount")}
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
