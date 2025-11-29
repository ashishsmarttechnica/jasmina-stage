"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useResendOtp from "@/hooks/auth/useResendOtp";
import useUserResetAndForgotPass from "@/hooks/auth/userResetAndForgotPass";
import { useForgotPasswordVerifyOtp } from "@/hooks/auth/useVerifyOtp";
import useForgotPassValidationForm from "@/hooks/validation/auth/useForgotPassValidationForm";
import EmailStep from "./EmailStep";
import NewPasswordStep from "./NewPasswordStep";
import OtpStep from "./OtpStep";

const ForgotPasswordForm = () => {
  const t = useTranslations("auth");
  const { errors, validateForm } = useForgotPassValidationForm();

  const [formData, setFormData] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const { mutate: resendOtp, isPending: isResendingOtp } = useResendOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useForgotPasswordVerifyOtp();
  const { mutate: resetPassword, isPending: isResettingPassword } = useUserResetAndForgotPass();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Step 1: Email submit
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!validateForm({ email: formData.email })) return;
    resendOtp(
      { email: formData.email },
      {
        onSuccess: (res) => {
          if (res.success) {
            setStep(2);
          }
        },
      }
    );
  };

  // OTP handlers
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.querySelectorAll("input")[index + 1];
      nextInput?.focus();
    }
  };
  // Handle backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelectorAll("input")[index - 1];
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();

    if (!/^\d{6}$/.test(pasteData)) {
      toast.error(t("otpPasteError"));
      return;
    }

    const otpArray = pasteData.split("");
    setOtp(otpArray);
    const lastInput = document.querySelectorAll("input")[5];
    lastInput?.focus();
  };

  const handleVerify = () => {
    const fullOtp = otp.join("").trim();

    if (fullOtp.length !== 6 || otp.includes("")) {
      toast.error(t("otpError"));
      return;
    }

    verifyOtp(
      { otp: fullOtp, email: formData.email },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowNewPasswordForm(true);
            setStep(3);
          }
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!formData.email || cooldown > 0) return;
    setIsResending(true);
    resendOtp(
      { email: formData.email },
      {
        onSuccess: (res) => {
          if (res.success) {
            setCooldown(120);
            setIsResending(false);
          }
        },
      }
    );
  };

  // Step 3: New password submit
  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error(t("passwordRequired"));
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error(t("passwordLengthError"));
      return;
    }
    resetPassword({ email: formData.email, newPassword: formData.newPassword });
  };

  return (
    <>
      {step === 1 && (
        <EmailStep
          email={formData.email}
          onEmailChange={(e) => setFormData({ ...formData, email: e.target.value })}
          onSubmit={handleEmailSubmit}
          isPending={isResendingOtp}
          errors={errors}
          t={t}
        />
      )}

      {step === 2 && !showNewPasswordForm && (
        <OtpStep
          otp={otp}
          onOtpChange={handleOtpChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onVerify={handleVerify}
          onResendOtp={handleResendOtp}
          isResending={isResending}
          cooldown={cooldown}
          isPending={isVerifyingOtp}
          t={t}
        />
      )}

      {step === 3 && showNewPasswordForm && (
        <NewPasswordStep
          newPassword={formData.newPassword}
          confirmPassword={formData.confirmPassword}
          onNewPasswordChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          onConfirmPasswordChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          onSubmit={handleNewPasswordSubmit}
          isPending={isResettingPassword}
        />
      )}
    </>
  );
};

export default ForgotPasswordForm;
