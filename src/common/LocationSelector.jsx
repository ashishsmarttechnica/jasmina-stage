import Selecter from "@/common/Selecter";
import { useCities, useCountries, useStates } from "@/hooks/location/useLocationData";
import useLocationStore from "@/store/location.store";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const LocationSelector = ({ value, onChange, error, onFieldChange, isLGBTQ, countryLabel }) => {
  const t = useTranslations("Common");
  const {
    selectedCountry,
    selectedCountryCode,
    selectedState,
    selectedCity,
    setSelectedCountry,
    setSelectedState,
    setSelectedCity,
  } = useLocationStore();
  // console.log(selectedCountry, selectedCountryCode, "selectedCountryCode");
  const [cityInput, setCityInput] = useState("");
  const [manualCityEntry, setManualCityEntry] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Flag to prevent value changes from affecting manual entry mode
  const isUserEditingManually = useRef(false);

  // Use a ref to track if we should update the location string
  const prevLocationString = useRef("");
  const initialLoadDone = useRef(false);

  const { data: countries, isLoading: isLoadingCountries } = useCountries();
  // console.log(countries, "countries");

  // Debug the countries data
  const { data: states, isLoading: isLoadingStates } = useStates(selectedCountry);
  const {
    data: cities,
    isLoading: isLoadingCities,
    isError: isCitiesError,
  } = useCities(selectedCountry, selectedState);

  // Check if location is complete
  const isLocationComplete = useMemo(() => {
    if (manualCityEntry) {
      return Boolean(selectedCountry && selectedState && cityInput);
    } else {
      return Boolean(selectedCountry && selectedState && selectedCity);
    }
  }, [selectedCountry, selectedState, selectedCity, cityInput, manualCityEntry]);

  // Show errors when error prop is passed
  useEffect(() => {
    if (error && !showErrors) {
      setShowErrors(true);
    } else if (!error && showErrors) {
      setShowErrors(false);
    }
  }, [error, showErrors]);

  // Handle external value changes
  useEffect(() => {
    // Skip processing if user is manually editing
    if (isUserEditingManually.current) {
      return;
    }

    // Skip processing if value hasn't changed
    if (value === prevLocationString.current) {
      return;
    }

    if (value) {
      try {
        const parts = value.split(",").map((part) => part.trim());

        if (parts.length >= 3) {
          const [city, state, country] = [parts[0], parts[1], parts[2]];
          setSelectedCountry(country);
          setSelectedState(state);

          // Only update city-related fields if not in manual mode
          if (!manualCityEntry) {
            setSelectedCity(city);
            setCityInput("");
          } else if (!cityInput) {
            // In manual mode but no city input yet, initialize it
            setCityInput(city);
          }
        } else if (parts.length === 2) {
          const [state, country] = [parts[0], parts[1]];
          setSelectedCountry(country);
          setSelectedState(state);

          // Reset city fields
          if (!manualCityEntry) {
            setSelectedCity("");
          }
          if (manualCityEntry && cityInput) {
            // Don't reset manually entered city input unless empty
            // This avoids wiping out user's manual entry
            //
          } else {
            setCityInput("");
          }
        } else if (parts.length === 1) {
          setSelectedCountry(parts[0]);
          setSelectedState("");

          // Reset city fields
          if (!manualCityEntry) {
            setSelectedCity("");
          }
          if (!manualCityEntry || !cityInput) {
            setCityInput("");
          }
        }
      } catch (err) {
        console.error("Error parsing location:", err);
      }
    } else {
      setSelectedCountry("");
      setSelectedState("");

      // Only update city-related fields if not in manual mode or if city input is empty
      if (!manualCityEntry) {
        setSelectedCity("");
      }
      if (!manualCityEntry || !cityInput) {
        setCityInput("");
      }
    }
  }, [value, manualCityEntry]);

  // Handle manual city input
  const handleCityInput = useCallback((e) => {
    const { value } = e.target;
    isUserEditingManually.current = true;
    setCityInput(value);
  }, []);

  // Update location string and trigger onChange when relevant fields change
  useEffect(() => {
    // Skip on initial mount
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      return;
    }

    let locationString = "";

    if (manualCityEntry && selectedState && selectedCountry) {
      // Always use cityInput for location string when in manual mode
      locationString = cityInput
        ? `${cityInput}, ${selectedState}, ${selectedCountry}`
        : `${selectedState}, ${selectedCountry}`;
    } else if (selectedCity && selectedState && selectedCountry) {
      locationString = `${selectedCity}, ${selectedState}, ${selectedCountry}`;
    } else if (selectedState && selectedCountry) {
      locationString = `${selectedState}, ${selectedCountry}`;
    } else if (selectedCountry) {
      locationString = selectedCountry;
    }

    // Keep country code in sync in the store
    const countryObjForCode = countries?.find((c) => c.country === selectedCountry) || null;
    if (countryObjForCode?.code) {
      try {
        // optional chaining if setter exists
        useLocationStore.getState().setSelectedCountryCode?.(countryObjForCode.code);
      } catch { }
    }

    // Only update when the string actually changes to avoid loops
    if (locationString !== prevLocationString.current) {
      prevLocationString.current = locationString;

      // Don't call onChange if locationString is empty or unchanged
      if (locationString) {
        // Find the country object that matches the selected country name
        const countryObj = countries?.find((c) => c.country === selectedCountry) || null;
        console.log(countryObj, "countryObj+++++++++++++++");
        // Always pass both the value and a details object (backward compatible: extra args are ignored)
        const details = {
          country: selectedCountry || "",
          countryCode: countryObj?.code || "",
          isLGBTQ: countryObj?.isLGBTQ,
        };
        onChange(locationString, details);
      }

      // Only trigger onFieldChange when location is fully complete
      if (isLocationComplete && onFieldChange) {
        onFieldChange("location");
      }
    }
  }, [
    selectedCountry,
    selectedState,
    selectedCity,
    cityInput,
    manualCityEntry,
    onChange,
    isLocationComplete,
    onFieldChange,
    countries,
    isLGBTQ,
  ]);

  // Handle country change
  const handleCountryChange = useCallback(
    (e) => {
      const { value } = e.target;
      setSelectedCountry(value);
      setSelectedState("");
      setSelectedCity("");
      setCityInput("");
      setManualCityEntry(false);
      isUserEditingManually.current = false;
    },
    [setSelectedCountry, setSelectedState, setSelectedCity]
  );

  // Handle state change
  const handleStateChange = useCallback(
    (e) => {
      const { value } = e.target;
      setSelectedState(value);
      setSelectedCity("");
      setCityInput("");
      setManualCityEntry(false);
      isUserEditingManually.current = false;
    },
    [setSelectedState, setSelectedCity]
  );

  // Handle city change
  const handleCityChange = useCallback(
    (e) => {
      const { value } = e.target;
      setSelectedCity(value);
      setCityInput("");
      setManualCityEntry(false);
      isUserEditingManually.current = false;
    },
    [setSelectedCity]
  );

  // Toggle manual city entry
  const toggleManualEntry = useCallback(() => {
    isUserEditingManually.current = true;
    const newManualEntryState = !manualCityEntry;
    setManualCityEntry(newManualEntryState);

    if (newManualEntryState === false) {
      // Switching back to dropdown
      setCityInput("");
    } else {
      // Switching to manual entry
      setSelectedCity("");
    }
  }, [manualCityEntry]);

  // Format options for selectors
  const countryOptions = useMemo(() => {
    if (!countries || !Array.isArray(countries)) return [];

    // Return all countries without filtering

    return countries.map((countryObj) => ({
      label: countryObj.country,
      value: countryObj.country,
      code: countryObj.code || "",
    }));
  }, [countries]);

  // console.log(countries, "countryObj")
  // console.log(countryOptions, "options");

  const stateOptions = useMemo(() => {
    if (!states || !Array.isArray(states)) return [];

    return states.map((state) => ({
      label: state,
      value: state,
    }));
  }, [states]);

  // Process cities data and remove duplicates
  const cityOptions = useMemo(() => {
    if (!Array.isArray(cities)) return [];

    // Create a map to track unique cities
    const uniqueCities = new Map();

    cities.forEach((city) => {
      const cityName = typeof city === "string" ? city : city.name || city.city || city;
      if (!uniqueCities.has(cityName)) {
        uniqueCities.set(cityName, {
          label: cityName,
          value: cityName,
        });
      }
    });

    // Convert map to array
    return Array.from(uniqueCities.values());
  }, [cities]);

  // Check if we have city data
  const hasCityData = useMemo(() => cityOptions.length > 0, [cityOptions]);

  // Determine if selectors should be searchable based on number of options
  const isCountrySearchable = useMemo(() => countryOptions.length > 10, [countryOptions]);
  const isStateSearchable = useMemo(() => stateOptions.length > 10, [stateOptions]);
  const isCitySearchable = useMemo(() => cityOptions.length > 10, [cityOptions]);

  // Get error messages based on validation state
  const getCountryError = () => {
    if (showErrors && !selectedCountry) {
      return t("countryRequired") || "Country is required";
    }
    return "";
  };

  // const getStateError = () => {
  //   if (showErrors && selectedCountry && !selectedState) {
  //     return t("stateRequired") || "State is required";
  //   }
  //   return "";
  // };

  // const getCityError = () => {
  //   if (showErrors && selectedCountry && selectedState) {
  //     if (!manualCityEntry && !selectedCity) {
  //       return t("cityRequired") || "City is required";
  //     } else if (manualCityEntry && !cityInput) {
  //       return t("cityRequired") || "City is required";
  //     }
  //   }
  //   return "";
  // };

  // Use custom country label if provided, otherwise use default
  const displayCountryLabel = countryLabel || `${t("country")}*`;

  return (
    <div>
      {/* Row layout for all dropdowns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Country Selector */}
        <div>
          <Selecter
            name="country"
            label={displayCountryLabel}
            placeholder={t("selectCountry")}
            value={selectedCountry}
            onChange={handleCountryChange}
            options={countryOptions}
            error={getCountryError()}
            isLoading={isLoadingCountries}
            isSearchable={isCountrySearchable}
          />
        </div>

        {/* State Selector */}
        <div>
          <Selecter
            name="state"
            label={`${t("state")} `}
            placeholder={t("selectState")}
            value={selectedState}
            onChange={handleStateChange}
            options={stateOptions}
            // error={getStateError()}
            isLoading={isLoadingStates && selectedCountry}
            disabled={!selectedCountry || isLoadingStates || stateOptions.length === 0}
            isSearchable={isStateSearchable}
          />
        </div>

        {/* City Selector */}
        <div>
          {manualCityEntry ? (
            <div className="space-y-1">
              <label className="text-grayBlueText text-[14px]">{`${t("city")}*`}</label>
              <input
                type="text"
                name="cityInput"
                value={cityInput}
                onChange={handleCityInput}
                placeholder={t("enterCityManually")}
              // className={`focus:ring-primary-500 focus:border-primary-500 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none ${
              //   getCityError() ? "border-red-500" : "border-gray-300"
              // }`}
              />
              {/* {getCityError() && <p className="mt-1 text-sm text-red-500">{getCityError()}</p>} */}
            </div>
          ) : (
            <Selecter
              name="city"
              label={`${t("city")} `}
              placeholder={t("selectCity")}
              value={selectedCity}
              onChange={handleCityChange}
              options={cityOptions}
              // error={getCityError()}
              isLoading={isLoadingCities && selectedState && selectedCountry}
              disabled={
                !selectedState || !selectedCountry || isLoadingCities || cityOptions.length === 0
              }
              isSearchable={isCitySearchable}
            />
          )}
        </div>
      </div>

      {/* Manual city entry toggle button */}
      {selectedCountry && selectedState && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={toggleManualEntry}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {manualCityEntry ? t("useDropdown") : t("enterCityManually")}
          </button>
        </div>
      )}

      {/* Global error message - shown if form was submitted and location is incomplete */}
      {error && !isLocationComplete && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default LocationSelector;
