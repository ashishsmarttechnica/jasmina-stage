import { getSearchSuggestions } from "@/api/search.api";
import { useRemoveConnection } from "@/hooks/connections/useConnections";
import { useRouter } from "@/i18n/navigation";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsBriefcase } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { useAcceptConnection } from "../../hooks/user/useNetworkInvites";
import { FaFilter } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SearchBar = ({ placeholder = "Search..." }) => {
  const t = useTranslations("Common");
  const router = useRouter();
  const params = useParams();
  const paramsUserId = params?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState({ users: [], companies: [], jobs: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const abortControllerRef = useRef(null);
  const currentSearchRef = useRef("");
  const searchTimerRef = useRef(null);
  const userId = params?.id;
  const searchParams = useSearchParams();
  const isFromConnections = searchParams?.get("fromConnections") === "true";
  const isFromNetworkInvites = searchParams?.get("fromNetworkInvites") === "true";
  // const { mutate: createConnection, isPending: isConnecting } = useCreateConnection();
  // const { data: userData, error } = useSingleCompany(userId);
  // console.log(userData, "userData single company");
  const [isRemoving, setIsRemoving] = useState(false);

  const [showConnect, setShowConnect] = useState(!(isFromConnections || isFromNetworkInvites));

  // Filter dropdown state
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Categories" },
    { value: "location", label: "Location", fields: ["profile.location", "country"] },
    { value: "username", label: "Username", fields: ["profile.userName"] },
    { value: "fullName", label: "Full Name", fields: ["profile.fullName"] },
    { value: "jobRole", label: "Job Role", fields: ["preferences.jobRole", "jobTitle"] },
    { value: "companyType", label: "Company Type", fields: ["companyType"] },
    { value: "companyName", label: "Company Name", fields: ["companyName"] },
    { value: "industryType", label: "Industry Type", fields: ["industryType"] },
    { value: "department", label: "Department", fields: ["department"] },
    { value: "skills", label: "Skills", fields: ["skills.name"] },
  ];

  const buildPreservedQuery = () => {
    const qp = new URLSearchParams();
    // Always preserve existing context flags
    if (isFromNetworkInvites) qp.set("fromNetworkInvites", "true");
    if (isFromConnections) qp.set("fromConnections", "true");
    // If no flags present, match original behavior by adding fromConnections
    if (!isFromConnections && !isFromNetworkInvites && showConnect) {
      qp.set("fromConnections", "true");
    }
    const qs = qp.toString();
    return qs ? `?${qs}` : "";
  };
  const { mutate: acceptConnection, isPending } = useAcceptConnection();
  const { mutate: removeConnection } = useRemoveConnection();
  // Handle click outside to close suggestions and dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search - only run when searchQuery or selectedFilter has value
  useEffect(() => {
    // Clear previous suggestions immediately when query changes
    if (!searchQuery.trim()) {
      setSuggestions({ users: [], companies: [], jobs: [] });
      setShowSuggestions(false);
      currentSearchRef.current = "";
      // Cancel any pending timer
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
        searchTimerRef.current = null;
      }
      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setIsLoading(false);
      return;
    }

    // Clear suggestions immediately when new search starts
    setSuggestions({ users: [], companies: [], jobs: [] });
    setIsLoading(true);

    // Cancel previous timer if any (before it triggers a request)
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }

    // Cancel previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Set new timer
    searchTimerRef.current = setTimeout(() => {
      searchTimerRef.current = null;
      handleSearch();
    }, 300);

    return () => {
      // Only clear timer on cleanup - don't abort request here
      // because if timer completed, request should proceed
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
        searchTimerRef.current = null;
      }
    };
  }, [searchQuery, selectedFilter]);

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setSuggestions({ users: [], companies: [], jobs: [] });
      setIsLoading(false);
      return;
    }

    // Store current search query to prevent race conditions
    currentSearchRef.current = query;

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setIsLoading(true);
      const userId = Cookies.get("userId");
      const response = await getSearchSuggestions({
        query,
        page: 1,
        userId,
        filter: selectedFilter !== "all" ? selectedFilter : undefined,
        signal: abortController.signal
      });

      // Only update if this is still the current search query (prevent race conditions)
      if (currentSearchRef.current === query && !abortController.signal.aborted) {
        setSuggestions({
          users: response?.success ? response.data.users || [] : [],
          companies: response?.success ? response.data.companies || [] : [],
          jobs: response?.success ? response.data.jobs || [] : [],
        });
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED' || abortController.signal.aborted) {
        return;
      }

      // Don't log 403/404 errors as they're handled as "no results"
      const status = error?.response?.status;
      if (status !== 403 && status !== 404) {
        console.error("Search error:", error);
      }

      // Only update if this is still the current search query
      if (currentSearchRef.current === query) {
        setSuggestions({ users: [], companies: [], jobs: [] });
      }
    } finally {
      // Only update loading state if this is still the current search
      if (currentSearchRef.current === query) {
        setIsLoading(false);
      }
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Clear suggestions immediately when input changes
    setSuggestions({ users: [], companies: [], jobs: [] });
    // Only show suggestions if there's a query
    if (value.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      currentSearchRef.current = "";
    }
  };
  // const handleRemoveConnection = () => {
  //   if (!paramsUserId) return;

  //   setIsRemoving(true);

  //   removeConnection(
  //     {
  //       id: paramsUserId,
  //       role: "Company",
  //     },
  //     {
  //       onSuccess: (res) => {
  //         if (res.success) {
  //           // Refresh the page to update the UI
  //           setShowConnect(true);
  //         } else {
  //           toast.error(res?.message || "Failedtoremoveconnection");
  //         }
  //       },
  //       onError: (error) => {
  //         toast.error(error?.message || "Failedtoremoveconnection");
  //       },
  //       onSettled: () => {
  //         setIsRemoving(false);
  //       },
  //     }
  //   );
  // };

  // const handleConnect = () => {
  //   if (!paramsUserId) return;
  //   acceptConnection(
  //     { id: paramsUserId, role: "Company" },
  //     {
  //       onSuccess: (res) => {
  //         if (res.success
  //           setShowConnect(false);
  //         } else {
  //           toast.error(res?.message | "Failedtoacceptconnection");
  //         }
  //       },
  //       onError: (error) => {
  //         toast.error(error?.message || "Failedtoacceptconnection");
  //       },
  //     }
  //   );
  // };
  const handleSuggestionClick = (suggestion, type) => {
    const userRole = Cookies.get("userRole");
    const userId = Cookies.get("userId");

    switch (type) {
      case "user":
        router.push(`/single-user/${suggestion._id}${buildPreservedQuery()}`);
        break;

      case "company":
        router.push(`/company/single-company/${suggestion._id}${buildPreservedQuery()}`);
        break;

      case "job":
        {
          userRole === "Company"
            ? router.push(`/jobs`)
            : router.push(`/company/single-company/${userId}/applications`);

          userRole === "User"
            ? router.push(`/company/single-company/${userId}/applications`)
            : router.push(`/jobs`);
        }
        break;

      default:
        setSearchQuery("");
    }

    setShowSuggestions(false);
  };

  const renderUserSuggestions = () => {
    return suggestions.users.map((user, index) => (
      <div
        key={user._id || index}
        onClick={() => handleSuggestionClick(user, "user")}
        className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-[#f3f6f8]"
      >
        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
          {user.profile?.profileImage ? (
            <Image
              src={user.profile.profileImage}
              alt={user.profile.fullName}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0a66c2] text-white">
              {user.profile?.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-medium text-[#000000]">{user.profile?.fullName}</div>
          {user.profile?.headline && (
            <div className="text-[12px] text-[#666666]">{user.profile.headline}</div>
          )}
        </div>
      </div>
    ));
  };

  const renderCompanySuggestions = () => {
    return suggestions.companies.map((company, index) => (
      <div
        key={company._id || index}
        className="flex items-center gap-3 px-4 py-2 hover:bg-[#f3f6f8]"
      >
        <div className="flex h-8 w-8 items-center justify-center">
          <HiOutlineBuildingOffice2 className="text-xl text-[#666666]" />
        </div>
        <div
          className="flex-1 cursor-pointer"
          onClick={() => handleSuggestionClick(company, "company")}
        >
          <div className="text-[14px] font-medium text-[#000000]">{company.companyName}</div>
          {company.industryType && (
            <div className="text-[12px] text-[#666666]">{company.industryType.join(", ")}</div>
          )}
        </div>
        <div>
          {/* {showConnect ? (
            <button className="connect-btn" onClick={handleConnect}>
              connect
            </button>
          ) : (
            <button
              onClick={handleRemoveConnection}
              disabled={isRemoving}
              className="text-primary border-primary border px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </button>
          )} */}
        </div>
      </div>
    ));
  };

  const renderJobSuggestions = () => {
    return suggestions.jobs.map((job, index) => (
      <div
        key={job._id || index}
        onClick={() => handleSuggestionClick(job, "job")}
        className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-[#f3f6f8]"
      >
        <div className="flex h-8 w-8 items-center justify-center">
          <BsBriefcase className="text-xl text-[#666666]" />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-medium text-[#000000]">{job.jobTitle}</div>
          {job.companyName && <div className="text-[12px] text-[#666666]">{job.companyName}</div>}
        </div>
      </div>
    ));
  };

  const selectedFilterLabel = filterOptions.find(opt => opt.value === selectedFilter)?.label || "All Categories";

  return (
    <div className="relative flex items-center" ref={searchContainerRef}>
      {/* Filter Dropdown */}
      <div className="relative" ref={dropdownRef}>
  <button
    type="button"
    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
    className={`flex items-center gap-1 sm:gap-2 rounded-l border border-[#37465c] px-2 sm:px-3 md:px-4 py-1.5 
    text-[11px] sm:text-[12px] md:text-[13px] font-medium transition-all duration-200
    ${
      showFilterDropdown
        ? "bg-white text-black"
        : "bg-[#132028] text-white hover:text-white hover:bg-[#132028]"
    } cursor-pointer`}
  >
    <FaFilter
      className={`text-sm sm:text-base flex-shrink-0 transition-all duration-200 
      ${showFilterDropdown ? "text-black" : "text-white hover:text-black"}`}
    />
    <span className="hidden sm:inline truncate max-w-[100px] md:max-w-none">
      {selectedFilterLabel}
    </span>
    {showFilterDropdown ? (
      <FaChevronUp
        className={`text-[10px] sm:text-[12px] md:text-[13px] transition-all duration-200 ${
          showFilterDropdown ? "text-black" : "text-white"
        }`}
      />
    ) : (
      <FaChevronDown
        className={`text-[10px] sm:text-[12px] md:text-[13px] transition-all duration-200 ${
          showFilterDropdown ? "text-black" : "text-white"
        }`}
      />
    )}
  </button>

  {/* Dropdown Menu */}
  {showFilterDropdown && (
    <div className="absolute top-full left-0 z-[60] mt-1.5 w-[220px] sm:w-[240px] md:w-[260px] max-h-[300px] sm:max-h-[380px] md:max-h-[420px] overflow-y-auto rounded-[6px] border border-[#d1d5db] bg-[#fafbfc] shadow-xl backdrop-blur-sm">
      <div className="py-1">
        {filterOptions.map((option, index) => (
          <div
            key={option.value}
            onClick={() => {
              setSelectedFilter(option.value);
              setShowFilterDropdown(false);
            }}
            className={`px-4 py-2.5 text-[13px] cursor-pointer transition-all duration-150 ${
              selectedFilter === option.value
                ? "bg-[#e6f2ff] text-[#0a66c2] font-semibold border-l-[3px] border-[#0a66c2]"
                : "text-[#0f1111] hover:bg-[#f0f4f8] hover:text-[#0a66c2]"
            } ${index === 0 ? "rounded-t-[6px]" : ""} ${
              index === filterOptions.length - 1 ? "rounded-b-[6px]" : ""
            }`}
          >
            <div className="flex items-center">
              {selectedFilter === option.value && (
                <span className="mr-2 text-[#0a66c2]">✓</span>
              )}
              <span>{option.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

      {/* Search Input Container */}
      <div className="relative flex-1  border border-[#37465c]">
        <div className="flex items-center justify-between rounded-r bg-[#132028] border border-[#37465c] focus-within:border-[#fff] focus-within:shadow-[0_0_0_1px_#0a66c2] search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => {
              // Only show suggestions if there's a search query
              if (searchQuery.trim().length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            className="bg-transparent px-2 sm:px-3 py-1.5 text-[12px] sm:text-[13px] font-normal text-white outline-none placeholder:text-white w-full"
          />
          <div className="flex items-center pr-2 sm:pr-3">
            <FiSearch className="text-lg sm:text-xl text-white" />
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && searchQuery.length > 0 && (
          <div className="absolute top-[100%] left-0 right-0 z-50 mt-1 max-h-[400px] overflow-y-auto rounded-[4px] border border-[#e0e0e0] bg-white shadow-lg">
            {isLoading ? (
              <div className="p-3 text-center text-[#666666]">{t("loading")}</div>
            ) : suggestions.users.length > 0 ||
              suggestions.companies.length > 0 ||
              suggestions.jobs.length > 0 ? (
              <div>
                {suggestions.users.length > 0 && (
                  <div>
                    <div className="bg-[#f3f6f8] px-4 py-2 text-[12px] font-medium text-[#666666]">
                      {t("people")}
                    </div>
                    {renderUserSuggestions()}
                  </div>
                )}

                {suggestions.companies.length > 0 && (
                  <div>
                    <div className="bg-[#f3f6f8] px-4 py-2 text-[12px] font-medium text-[#666666]">
                      {t("companies")}
                    </div>
                    {renderCompanySuggestions()}
                  </div>
                )}

                {suggestions.jobs.length > 0 && (
                  <div>
                    <div className="bg-[#f3f6f8] px-4 py-2 text-[12px] font-medium text-[#666666]">
                      {t("jobs")}
                    </div>
                    {renderJobSuggestions()}
                  </div>
                )}

                {/* <div className="border-t border-[#e0e0e0] p-3">
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="w-full text-center text-[14px] text-[#0a66c2] hover:underline"
                >
                  See all results
                </button>
              </div> */}
              </div>
            ) : (
              <div className="p-3 text-center text-[#666666]">{t("noResults")}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
