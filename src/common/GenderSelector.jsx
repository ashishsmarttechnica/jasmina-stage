"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const GenderSelector = ({ value, onChange, error }) => {
  const options = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val) => {
    onChange({ target: { name: "gender", value: val } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-grayBlueText text-[14px]">Gender</label>

      <div
        className="border-lightGray/[75%] flex w-full cursor-pointer items-center justify-between rounded-md border bg-white p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? options.find((o) => o.value === value)?.label : "Select Gender"}

        <FiChevronDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-lightGray/50 absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`hover:bg-lightGray/20 cursor-pointer px-4 py-2 ${
                  value === option.value ? "bg-lightGray/30 font-medium" : ""
                }`}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default GenderSelector;
