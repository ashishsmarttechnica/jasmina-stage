"use client";
import { useState } from "react";

const RadioGroup = ({
  title,
  options,
  name,
  defaultValue,
  onChange,
  bordered = true,
  className = "",
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value);

  const handleChange = (value) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="text-base text-custBlack mb-3 font-semibold">{title}</h3>}

      <div className={bordered ? "border-neutralLight2 border-t py-4" : ""}>
        <div className="flex flex-wrap gap-4">
          {options.map((option) => (
            <div key={option.value} className="mr-4 mb-2 flex cursor-pointer items-center">
              <label className="flex cursor-pointer items-center gap-2.5">
                <div className="relative">
                  <input
                    id={`${name}-${option.value}`}
                    name={name}
                    type="radio"
                    value={option.value}
                    checked={selectedValue === option.value}
                    onChange={() => handleChange(option.value)}
                    className="peer sr-only"
                  />
                  <div className="peer-checked:border-primary flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        selectedValue === option.value ? "bg-primary" : "bg-transparent"
                      } transition-colors`}
                    ></div>
                  </div>
                </div>
                <span className="text-custBlack text-sm">{option.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadioGroup;
