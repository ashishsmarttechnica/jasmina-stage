import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({
  placeholder,
  searchValue = "",
  onSearch,
  onSearchSubmit,
  isSearching = false,
}) => {
  const t = useTranslations("Applications");
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchValue(value);
    // Don't call onSearch here - only update local state
  };

  const handleSearchClick = () => {
    // Only call onSearch and onSearchSubmit when button is clicked
    onSearch(localSearchValue);
    onSearchSubmit();
  };

  const handleClearSearch = () => {
    setLocalSearchValue("");
    onSearch("");
    onSearchSubmit();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(localSearchValue);
      onSearchSubmit();
    }
  };

  // Update local state when searchValue prop changes
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input - Responsive */}
      <div className="flex w-full items-center rounded-md bg-white px-3 py-2 sm:max-w-xs md:max-w-sm lg:max-w-[224px] xl:max-w-[210px]">
        <FiSearch className="mr-2 text-lg text-gray-500 sm:text-xl md:text-2xl" />
        <input
          type="text"
          placeholder={placeholder || t("search.placeholder")}
          value={localSearchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none sm:text-base"
        />
      </div>

      {/* Search Button - Responsive */}
      <div className="flex justify-end sm:justify-start">
        <button
          onClick={handleSearchClick}
          disabled={isSearching}
          className={`bg-primary w-full rounded-sm px-4 py-2 text-[13px] text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm ${isSearching ? "cursor-not-allowed opacity-50" : "hover:bg-primary/90"
            }`}
        >
          {isSearching ? t("search.searching") : t("search.button")}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
