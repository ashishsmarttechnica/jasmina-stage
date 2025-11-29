"use client";
import galleryIcon from "@/assets/gallery.png";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
// import galleryIcon1 from "@/assets/gallery-1.png";

import Image from "next/image";

const JobHeader = ({ filters, setFilters, onFindJob, showSaveJobsLink = true }) => {
  const t = useTranslations("Jobs");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState((filters.lgbtq === "true" || filters.lgbtq === true) ? t("lgbtqOption") : t("all")); // Default to All
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [locationInput, setLocationInput] = useState(filters.location || "");
  const [showRemoteJobsOnly, setShowRemoteJobsOnly] = useState(false);
  const options = [t("lgbtqOption"), t("all")];

  // Trigger initial search with lgbtq=false when component mounts
  useEffect(() => {
    const initialFilters = {
      search: searchInput,
      location: locationInput,
      lgbtq: filters.lgbtq || false,
      remote: false,
    };
    setFilters(initialFilters);
    // if (onFindJob) {
    //   onFindJob(initialFilters);
    // }
  }, []); // Empty dependency array means this runs once on mount

  const handleFindJob = () => {
    const effectiveLocation = showRemoteJobsOnly ? "Remote" : locationInput;
    const newFilters = {
      search: searchInput,
      location: effectiveLocation,
      lgbtq: selected === t("all") ? false : true,
      remote: showRemoteJobsOnly,
    };
    // console.log("Setting filters:", newFilters);
    setFilters(newFilters);

    // Call the onFindJob callback if provided
    if (onFindJob) {
      onFindJob(newFilters);
    }
  };

  return (
    <div className="flex flex-col items-stretch justify-between gap-1 rounded-md bg-white px-2 py-1 shadow-sm sm:items-center sm:gap-1 lg:flex-row 2xl:mx-0">
      <div className="flex w-full flex-col justify-center gap-2 py-1 lg:flex-row lg:justify-start lg:gap-0">
        <div className="text-grayBlueText flex w-full items-center justify-around rounded-md border border-black/10 px-3 py-1 lg:max-w-[224px] lg:border-none xl:w-[240px] xl:max-w-[240px]">
          <FiSearch className="text-grayBlueText mr-2 text-2xl lg:text-3xl" />
          <input
            type="text"
            placeholder={t("jobTitleOrCompanyPlaceholder")}
            className="placeholder-grayBlueText w-full text-[16px] outline-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="text-grayBlueText hidden w-full items-center justify-center border-black/10 px-2 py-1 text-[16px] lg:flex lg:max-w-[171px] lg:border-x">
          <HiOutlineLocationMarker className="text-grayBlueText mr-2 text-2xl lg:text-3xl" />
          <input
            type="text"
            placeholder={t("location")}
            className="placeholder-grayBlueText w-full text-[16px] outline-none"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mx-2 mt-2">
            <input
              type="checkbox"
              checked={showRemoteJobsOnly}
              onChange={(e) => setShowRemoteJobsOnly(e.target.checked)}
            />
            <span className="text-grayBlueText text-sm text-[14px] leading-[21px]"> Show remote jobs only</span>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col sm:flex-row gap-2 pb-0.5 lg:max-w-[216px] xl:pr-2">
        <div className="flex gap-2 w-full">
          <div className="text-grayBlueText w-1/2 flex items-center rounded-md border border-black/10 px-3 sm:w-[40%] lg:hidden lg:max-w-[157px] lg:border-x 2xl:w-[157px]">
            <HiOutlineLocationMarker className="text-grayBlueText mr-2 text-2xl lg:text-3xl" />
            <input
              type="text"
              placeholder={t("location")}
              className="placeholder-grayBlueText w-full text-[16px] outline-none"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </div>

          <div className="relative flex-1 w-1/2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-uiLight shadow-job-dropdown flex w-full items-center justify-between rounded-md px-3 py-1"
            >
              <div className="text-grayBlueText flex items-center gap-2 text-[16px]">
                {selected === t("all")}
                {selected === t("lgbtqOption") && (
                  <Image
                    src={galleryIcon}
                    alt="LGBTQ friendly"
                    width={22}
                    height={22}
                    className="inline-block"
                  />
                )}
                <span>{selected}</span>
              </div>
              <FaChevronDown
                className={`text-grayBlueText text-base transition-transform duration-500 ${isOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isOpen && (
              <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setSelected(option);
                      setIsOpen(false);
                    }}
                    className="text-grayBlueText cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {option === t("lgbtqOption") && (
                      <Image
                        src={galleryIcon}
                        alt="LGBTQ friendly"
                        width={22}
                        height={22}
                        className="inline-block mr-2"
                      />
                    )}
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-1">
          {/* {showSaveJobsLink && (
            <Link href="/jobs/save-jobs">
              <button className="flex items-center gap-1 rounded-sm border border-[#0F8200] bg-transparent px-2 py-1.5 text-[13px] !leading-[15px] font-medium whitespace-nowrap text-[#0F8200] transition-all duration-200 hover:bg-[#0F8200] hover:text-white">
                <FaBookmark size={12} />
                {t("saved")}
              </button>
            </Link>
          )} */}
          <button
            className="rounded-sm border border-white bg-[#0F8200] px-2 py-1.5 text-[13px] !leading-[15px] font-medium whitespace-nowrap text-white transition-all duration-200 hover:border hover:border-[#0F8200] hover:bg-transparent hover:text-[#0F8200]"
            onClick={handleFindJob}
          >
            {t("findJob")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
