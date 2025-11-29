"use client";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const OtpStep = ({
  otp,
  onOtpChange,
  onKeyDown,
  onPaste,
  onVerify,
  onResendOtp,
  isResending,
  cooldown,
  isPending,
}) => {
  const inputRefs = useRef([]);
  const t = useTranslations("auth");
  return (
    <div>
      <div className="mt-8 mb-5 space-y-2">
        <div className="grid grid-cols-6 gap-x-1 gap-y-2 sm:gap-x-4">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => onOtpChange(e, index)}
              onKeyDown={(e) => onKeyDown(e, index)}
              onPaste={onPaste}
              ref={(el) => (inputRefs.current[index] = el)}
              className="border-custBlack/[45%] focus:ring-primary hover:border-primary hover:bg-primary/5 active:bg-primary/10 rounded-md border p-1 text-center text-2xl transition-all duration-200 ease-in-out focus:border-transparent focus:ring-1 focus:outline-none sm:w-[75px] sm:p-2 md:h-[75px]"
            />
          ))}
        </div>
      </div>

      <div>
        <div className="text-grayBlueText mx-auto max-w-md text-center text-[13px]">
          {t("DidntgetCode")}
          <button
            type="button"
            onClick={onResendOtp}
            disabled={isResending || cooldown > 0}
            className={`${isResending || cooldown > 0 ? "cursor-not-allowed text-gray-500" : "text-lightBlue hover:text-primary"} ml-1 underline`}
          >
            {isResending
              ? t("Resending")
              : cooldown > 0
                ? `${t("Resendin")} ${cooldown}s`
                : t("ClickToResend")}
          </button>
        </div>

        <button type="button" className="btn-fill mt-4" onClick={onVerify} disabled={isPending}>
          {isPending ? t("Verifying") : t("Verify")}
        </button>
      </div>
    </div>
  );
};

export default OtpStep;
// ek bar otp verify ho jane ke bad
