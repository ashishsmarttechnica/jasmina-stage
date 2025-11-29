"use client";

import { useEffect, useRef, useState } from "react";
import { FiClock } from "react-icons/fi";

const TimePicker = ({ label, name, value, onChange, error, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(value || "");
  const dropdownRef = useRef(null);

  // Generate time options in 30-minute intervals
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of ["00", "30"]) {
      const time = `${hour.toString().padStart(2, "0")}:${minute}`;
      timeOptions.push(time);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    onChange({ target: { name, value: time } });
    setIsOpen(false);
  };

  const formatTimeDisplay = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="text-grayBlueText mb-1 block text-[14px]">{label}</label>}
      <div className="relative">
        <input
          type="text"
          className={`border-lightGray/75 hover:border-primary hover:bg-primary/5 focus:border-primary focus:ring-primary/30 active:bg-primary/10 w-full rounded border p-2 pr-10 transition-all duration-200 ease-in-out focus:ring-1 focus:outline-none ${
            disabled ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"
          }`}
          value={formatTimeDisplay(selectedTime)}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          readOnly
          placeholder="Select time"
        />
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
          <FiClock className="text-primary" size={18} />
        </div>
      </div>

      {isOpen && (
        <div className="border-lightGray absolute z-50 mt-1 max-h-[200px] w-full overflow-y-auto rounded-md border bg-white shadow-lg">
          <div className="p-1">
            {timeOptions.map((time) => (
              <div
                key={time}
                className={`hover:bg-primary/10 cursor-pointer rounded px-3 py-2 text-sm transition-all ${
                  selectedTime === time ? "bg-primary/10 text-primary font-medium" : "text-gray-700"
                }`}
                onClick={() => handleTimeSelect(time)}
              >
                {formatTimeDisplay(time)}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TimePicker;
