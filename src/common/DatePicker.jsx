"use client";
import { useTranslations } from "next-intl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker-custom.css"; // Custom styling for the date picker

const CustomDatePicker = ({ value, onChange, maxDate, minDate, error, label, disabled }) => {
  const t = useTranslations("UserProfile.profile");
  return (
    <div className="space-y-1">
      <label className="text-grayBlueText text-[14px]">{label}</label>
      <div className="relative">
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          className="border-lightGray/[75%] focus:border-primary focus:ring-primary/30 w-full rounded-md border p-2 transition-all focus:ring-2 focus:outline-none"
          placeholderText={t("dobPlaceholder")}
          disabled={disabled}
          maxDate={maxDate ? new Date(maxDate) : undefined}
          minDate={minDate ? new Date(minDate) : undefined}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          wrapperClassName="w-full datepicker-wrapper"
          calendarClassName="custom-datepicker-calendar"
          dayClassName={(date) =>
            date.getDay() === 0 || date.getDay() === 6 ? "weekend-day" : undefined
          }
          renderYearContent={(year) => year}
          showMonthDropdown
          customInput={
            <input className="border-lightGray/75 hover:border-primary hover:bg-primary/5 focus:border-primary focus:ring-primary/30 active:bg-primary/10 w-full rounded border p-2 pr-10 transition-all duration-200 ease-in-out focus:ring-1 focus:outline-none" />
          }
        />
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.6949 13.7H15.7039M15.6949 16.7H15.7039M11.9949 13.7H12.0049M11.9949 16.7H12.0049M8.29492 13.7H8.30492M8.29492 16.7H8.30492"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CustomDatePicker;
