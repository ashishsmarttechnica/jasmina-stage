"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useVerifyOtp from "@/hooks/auth/useVerifyOtp";
import { useRouter } from "@/i18n/navigation";
import ReusableForm from "@/components/form/ReusableForm";
import { useTranslations } from "next-intl";
import useResendOtp from "@/hooks/auth/useResendOtp";



export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const role = searchParams.get("role");
  const router = useRouter();
  const t = useTranslations("auth");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  useEffect(() => {
    if (!email) {
      toast.error(t("emailRequired"));
      router.replace("/signup");
    }
  }, [email, router]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
    inputRefs.current[5]?.focus();
  };

  const handleVerify = () => {
    const fullOtp = otp.join("").trim();

    if (fullOtp.length !== 6 || otp.includes("")) {
      toast.error(t("otpError"));
      return;
    }

    verifyOtp({ email, otp: fullOtp });
  };

  const handleResendOtp = () => {
    if (!email || cooldown > 0) return;

    resendOtp(
      { email },
      {
        onSuccess: () => {
          setCooldown(120); // 2 minutes
        },
      }
    );
  };
  
  useEffect(() => {
    let timer;

    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [cooldown]);

  if (!email) return null;

  return (
    <ReusableForm
      title={t("otpTitle")}
      subtitle={t("otpsubTitle")}
      email={email}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        className="mt-7.5"
      >
        <div className="space-y-2 mb-5">
          <div className="grid grid-cols-6 gap-x-1 sm:gap-x-4 gap-y-2">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="border border-custBlack/[45%] p-1 sm:p-2 rounded-md sm:w-[75px] md:h-[75px] text-center text-2xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent hover:border-primary hover:bg-primary/5 active:bg-primary/10"
              />
            ))}
          </div>
        </div>

        <div>
          <div className="text-center mx-auto text-[13px] max-w-md text-grayBlueText">
            {t("DidntgetCode")}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || cooldown > 0}
              className="text-lightBlue ml-1 underline"
            >
              {isResending
                ? t("Resending")
                : cooldown > 0
                ? `${t("Resendin")} ${cooldown}s`
                : t("ClickToResend")}
            </button>
          </div>

          <button
            type="submit"
            className="btn-fill cursor-pointer"
            disabled={isPending}
          >
            {isPending ? t("Verifying") : t("Verify")}
          </button>
        </div>
      </form>
    </ReusableForm>
  );
}
