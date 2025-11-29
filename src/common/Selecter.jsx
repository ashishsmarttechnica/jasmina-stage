"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiEdit, FiSearch, FiX } from "react-icons/fi";
// Internal marker to identify custom values
const INTERNAL_OTHER_MARKER = "__other__";

const Selecter = ({
  name,
  value,
  onChange,
  error,
  options = [],
  label = "",
  placeholder = "",
  isLoading = false,
  disabled = false,
  isSearchable = false,
  isOther = false,
  isMulti = false,
  storageKey = null,
  isClearable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingOther, setIsEditingOther] = useState(false);
  const [internalOtherValue, setInternalOtherValue] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const otherInputRef = useRef(null);
  const t = useTranslations("UserProfile.userprofilemenu");
  const tc = useTranslations("Common");
  // Generate storage key if not provided
  const actualStorageKey = storageKey || (name ? `selecter_other_${name}` : null);

  // Normalize value to array for multi-select or single value for single-select
  const normalizedValue = isMulti ? (Array.isArray(value) ? value : value ? [value] : []) : value;

  // Determine if current value is a custom value (not in options list)
  const isCustomValue = isOther && !isMulti && value && !options.some((opt) => opt.value === value);

  // For multi-select, find custom values
  const customValues =
    isMulti && isOther
      ? normalizedValue.filter((val) => !options.some((opt) => opt.value === val))
      : [];

  // Reset internal state when component is unmounted or value changes externally
  useEffect(() => {
    // Reset editing state when dropdown closes
    if (!isOpen) {
      setIsEditingOther(false);
      setInternalOtherValue("");
    }
  }, [isOpen]);

  // Focus the other input when editing mode is activated
  useEffect(() => {
    if (isEditingOther && otherInputRef.current) {
      setTimeout(() => otherInputRef.current.focus(), 10);
    }
  }, [isEditingOther]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setIsEditingOther(false);
        setInternalOtherValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens with searchable enabled
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen, isSearchable]);

  // Update value in parent component
  const updateValue = (newValue) => {
    if (onChange && name) {
      onChange({
        target: {
          name,
          value: newValue,
        },
      });
    }
  };

  const handleSelect = (selectedValue) => {
    // If selecting "Other", enter editing mode
    if (selectedValue === INTERNAL_OTHER_MARKER) {
      // Always start with a blank input field for new custom values
      setInternalOtherValue("");
      setIsEditingOther(true);
      return;
    }

    if (isMulti) {
      // For multi-select, toggle the selected value
      const updatedValues = normalizedValue.includes(selectedValue)
        ? normalizedValue.filter((v) => v !== selectedValue)
        : [...normalizedValue, selectedValue];

      updateValue(updatedValues);
      // Keep dropdown open for multi-select
      setSearchTerm("");
    } else {
      // For single-select, update value and close dropdown
      updateValue(selectedValue);
      setIsOpen(false);
      setSearchTerm("");
      setIsEditingOther(false);
    }
  };

  const handleOtherConfirm = () => {
    const trimmedValue = internalOtherValue.trim();

    if (trimmedValue) {
      if (isMulti) {
        // For multi-select, add the custom value to the array
        if (!normalizedValue.includes(trimmedValue)) {
          const updatedValues = [...normalizedValue, trimmedValue];
          updateValue(updatedValues);

          // Save to localStorage if enabled
          if (actualStorageKey) {
            const customValues = updatedValues.filter(
              (val) => !options.some((opt) => opt.value === val)
            );
            localStorage.setItem(actualStorageKey, JSON.stringify(customValues));
          }
        }
      } else {
        // Update with the custom value directly for single-select
        updateValue(trimmedValue);

        // Save to localStorage if enabled
        if (actualStorageKey) {
          localStorage.setItem(actualStorageKey, trimmedValue);
        }
      }
    }

    // Always clear the input and close editing mode
    setInternalOtherValue("");
    setIsEditingOther(false);

    // For single select, close the dropdown
    if (!isMulti) {
      setIsOpen(false);
    }
  };

  const handleRemoveValue = (valueToRemove, e) => {
    e.stopPropagation(); // Prevent dropdown toggle
    if (isMulti) {
      const updatedValues = normalizedValue.filter((v) => v !== valueToRemove);
      updateValue(updatedValues);

      // Update localStorage for custom values
      if (isOther && actualStorageKey) {
        const customValues = updatedValues.filter(
          (val) => !options.some((opt) => opt.value === val)
        );
        if (customValues.length > 0) {
          localStorage.setItem(actualStorageKey, JSON.stringify(customValues));
        } else {
          localStorage.removeItem(actualStorageKey);
        }
      }
    }
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    updateValue(isMulti ? [] : "");
    setSearchTerm("");
    setInternalOtherValue("");

    // Clear localStorage for custom values
    if (isOther && actualStorageKey) {
      localStorage.removeItem(actualStorageKey);
    }

    // Close dropdown for single-select
    if (!isMulti) {
      setIsOpen(false);
    }
  };

  const handleOtherInputChange = (e) => {
    e.stopPropagation();
    setInternalOtherValue(e.target.value);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (isOpen) {
        setSearchTerm("");
        setIsEditingOther(false);
        setInternalOtherValue("");
      }
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSearchClick = (e) => e.stopPropagation();
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleOtherConfirm();
    }
  };

  // Filter options for search
  const filteredOptions = isSearchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  // Get label for a value
  const getLabelForValue = (val) => {
    const option = options.find((o) => o.value === val);
    return option ? option.label : val;
  };

  // Render the selected value or placeholder
  const renderLabel = () => {
    if (isLoading) return tc("loading");

    const effectivePlaceholder = placeholder || tc("selectOption");

    if (isMulti) {
      if (normalizedValue.length === 0) {
        // Return placeholder with proper text-gray-400 class
        return <span className="text-gray-400">{effectivePlaceholder}</span>;
      }

      // For multi-select with chips, show selected values
      return (
        <div className="flex flex-wrap gap-1">
          {normalizedValue.map((val) => (
            <div
              key={val}
              className="bg-primary/10 text-primary flex items-center rounded px-2 py-0.5 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="max-w-[150px] truncate">
                {options.some((o) => o.value === val)
                  ? getLabelForValue(val)
                  : `${t("freetext")}: ${val}`}
              </span>
              <button
                className="hover:bg-primary/20 ml-1 rounded-full p-0.5"
                onClick={(e) => handleRemoveValue(val, e)}
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (isCustomValue && typeof value === "string") return `${t("freetext")} : ${value}`;

    const matched = options.find((o) => o.value === value);
    return matched?.label || <span className="text-gray-400">{effectivePlaceholder}</span>;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="text-grayBlueText mb-1 block text-[14px]" htmlFor={name}>
          {label}
        </label>
      )}

      <div
        className={`border-lightGray/75 flex w-full items-center justify-between rounded border p-2 transition-all duration-200 ease-in-out ${disabled
          ? "cursor-not-allowed bg-gray-100 opacity-70"
          : "hover:border-primary hover:bg-primary/5 active:bg-primary/10 cursor-pointer"
          } ${isMulti ? "min-h-[42px]" : ""}`}
        onClick={toggleDropdown}
      >
        <div className={`flex-1 truncate`}>{renderLabel()}</div>

        {isLoading ? (
          <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2"></div>
        ) : (
          <>
            {isClearable && !isMulti && value && (
              <FiX
                className="mr-1 cursor-pointer text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  updateValue("");
                }}
              />
            )}
            <FiChevronDown
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                } ${isMulti ? (normalizedValue.length > 0 ? "text-black" : "text-gray-400") : value ? "text-black" : "text-gray-400"} ml-2 flex-shrink-0`}
            />
          </>
        )}
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-lightGray/50 absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg"
          >
            {isSearchable && !isEditingOther && (
              <div className="sticky top-0 border-b bg-white p-2">
                <div className="relative">
                  <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={handleSearchClick}
                    placeholder={t("Search")}
                    className="border-lightGray/75 focus:ring-primary hover:border-primary hover:bg-primary/5 active:bg-primary/10 w-full rounded border py-2 pr-3 pl-10 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-1 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {isEditingOther ? (
              <div className="p-2">
                <div className="flex items-center space-x-2">
                  <input
                    ref={otherInputRef}
                    type="text"
                    value={internalOtherValue}
                    onChange={handleOtherInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={t("freetext")}
                    autoFocus
                    className="border-lightGray/75 focus:ring-primary hover:border-primary hover:bg-primary/5 active:bg-primary/10 flex-1 rounded border px-3 py-2 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-1 focus:outline-none"
                  />
                  <button
                    onClick={handleOtherConfirm}
                    className="bg-primary hover:bg-primary/90 active:bg-primary/80 rounded px-3 py-2 text-white transition-colors duration-200"
                    type="button"
                  >
                    {tc("ok")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`hover:bg-primary/5 cursor-pointer px-4 py-2 transition-colors duration-200 ${isMulti
                      ? normalizedValue.includes(option.value)
                        ? "bg-primary/10 text-primary font-medium"
                        : ""
                      : value === option.value
                        ? "bg-primary/10 text-primary font-medium"
                        : ""
                      }`}
                  >
                    {option.label}
                  </div>
                ))}

                {isOther && (
                  <div
                    onClick={() => handleSelect(INTERNAL_OTHER_MARKER)}
                    className={`hover:bg-primary/5 mx-2 mt-1 flex cursor-pointer items-center gap-2 border px-4 py-2.5 transition-colors duration-200 ${isMulti
                      ? customValues.length > 0
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-600"
                      : isCustomValue
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-600"
                      }`}
                  >
                    <FiEdit className="text-sm" />
                    <span>{tc("customValue")}</span>
                  </div>
                )}

                {((isMulti && normalizedValue.length > 0) ||
                  (!isMulti && isClearable && value)) && (
                    <div className="mt-1 border-t pt-1">
                      <button
                        onClick={handleClearAll}
                        className="w-full px-4 py-2 text-sm text-red-500 transition-colors duration-200 hover:bg-red-50"
                        type="button"
                      >
                        {tc("clearAll")}
                      </button>
                    </div>
                  )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Selecter;
