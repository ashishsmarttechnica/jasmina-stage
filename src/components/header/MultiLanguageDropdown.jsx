"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

const localeLabels = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  ar: "Arabic",
};

export default function MultiLanguageDropdown() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const dropdownRef = useRef(null);

  const handleLocaleChange = (nextLocale) => {
    setSelectedLocale(nextLocale);
    setShowDropdown(false);

    const segments = pathname.split("/");
    if (routing.locales.includes(segments[1])) {
      segments.splice(1, 1); // Remove old locale
    }
    const cleanedPath = segments.join("/") || "/";
    router.replace(cleanedPath, { locale: nextLocale });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="flex w-full items-center justify-between cursor-pointer"
      >
        {localeLabels[selectedLocale]}
        <FaChevronDown
          className={`ms-4 h-3 w-3 ${
            showDropdown ? "rotate-180" : ""
          } transition-all duration-500`}
        />
      </button>

      <ul
        className={`absolute top-full left-0 z-10 mt-3 w-full outline outline-gray-400 rounded-md bg-white shadow-lg min-w-[140px] transform transition-all duration-300 ease-in-out ${
          showDropdown ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        }`}
        style={{ transformOrigin: "top" }}
      >
        {routing.locales.map((loc) => (
          <li
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`cursor-pointer px-4 py-2 text-custBlack text-sm border-gray-300 hover:bg-gray-100 ${
              selectedLocale === loc ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {localeLabels[loc]}
          </li>
        ))}
      </ul>
    </div>
  );
}
