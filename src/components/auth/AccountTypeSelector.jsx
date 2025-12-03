"use client";
import { useTranslations } from "next-intl";

const AccountTypeSelector = ({ value, onChange }) => {
  const t = useTranslations("auth");

  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center gap-1">
        <label className="text-grayBlueText text-[16px] font-medium">{t("AccountType")}</label>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        {["User", "NGO / Company"].map((type) => (
          <div className="flex-1" key={type}>
            <input
              type="radio"
              id={type}
              name="accountType"
              value={type}
              className="peer hidden"
              checked={value === type}
              onChange={() => onChange(type)}
            />
            <label
              htmlFor={type}
              className={`text-grayBlueText flex items-center justify-center border-2 p-3 ${value ? "border-grayBlueText/30" : "border-grayBlueText/50 border-dashed"} hover:border-primary hover:bg-secondary/20 peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary cursor-pointer rounded-lg transition-all duration-300 ease-in-out peer-checked:border-solid peer-checked:shadow-sm`}
            >
              <div className="flex items-center gap-2">
                {type === "User" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                )}
                <span className="font-medium capitalize">
                  {t(type === "User" ? "UserAccount" : "CompanyAccount")}
                </span>
              </div>

              {/* {!value && (
                <div className="absolute top-2 right-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs">
                    ?
                  </span>
                </div>
              )} */}
            </label>
          </div>
        ))}
      </div>

      {!value && (
        <p className="mt-2 flex items-center gap-1 text-xs text-amber-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {t("SelectAccountTypeWarning")}
        </p>
      )}
    </div>
  );
};

export default AccountTypeSelector;
