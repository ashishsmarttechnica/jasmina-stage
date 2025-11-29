import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Country, State, City } from "country-state-city";

// Cache country metadata from the library so we can reuse it for lookups
const COUNTRY_DATA = Country.getAllCountries();
const COUNTRY_LOOKUP = COUNTRY_DATA.reduce((acc, country) => {
  const normalizedName = country?.name?.trim().toLowerCase();
  const normalizedIso = country?.isoCode?.trim().toLowerCase();

  if (normalizedName) {
    acc.set(normalizedName, country);
  }
  if (normalizedIso) {
    acc.set(normalizedIso, country);
  }
  return acc;
}, new Map());

const normalizeValue = (value = "") => value.trim().toLowerCase();

const findCountryMeta = (countryName) => {
  if (!countryName) return null;
  const normalized = normalizeValue(countryName);
  return COUNTRY_LOOKUP.get(normalized) || null;
};

// Fetch all countries
export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      try {
        // Direct API call with debugging
        const response = await axiosInstance.get(`get/countries?limit=226`);

        // Handle different possible response formats
        if (response.data) {
          // Format 1: {data: [{country: "..."}]}
          if (Array.isArray(response.data.data)) {
            return response.data.data.map((country) => ({
              country: country.country || country.name || "",
              isLGBTQ: country.isLGBTQ || false,
              code: country.countryCode|| null,
            }));
          }
          // Format 2: {data: {data: [{country: "..."}]}}
          else if (response.data.data && Array.isArray(response.data.data.data)) {
            return response.data.data.data.map((country) => ({
              country: country.country || country.name || "",
              isLGBTQ: country.isLGBTQ || false,
              code: country.countryCode|| null,
            }));
          }
          // Format 3: {data: [...]} where data is an array of strings or objects
          else if (Array.isArray(response.data)) {
            return response.data.map((country) => {
              if (typeof country === "string") {
                return { country, isLGBTQ: false, code: country.countryCode|| null, };
              } else {
                return {
                  country: country.country || country.name || "",
                  isLGBTQ: country.isLGBTQ || false,
                 code: country.countryCode|| null,
                };
              }
            });
          }
        }

        console.error("Could not parse API response format:", response.data);
        return COUNTRY_DATA.map((country) => ({
          country: country.name,
          isLGBTQ: false,
          code: country.isoCode,
        }));
      } catch (error) {
        console.error("Error fetching countries:", error);
        return COUNTRY_DATA.map((country) => ({
          country: country.name,
          isLGBTQ: false,
          code: country.isoCode,
        })); // Fallback to library data on error
      }
    },
    staleTime: 300000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Fetch states for a given country
export const useStates = (country) => {
  return useQuery({
    queryKey: ["states", country],
    queryFn: async () => {
      if (!country) return [];

      const countryMeta = findCountryMeta(country);
      if (!countryMeta?.isoCode) {
        console.warn("Country not found in dataset:", country);
        return [];
      }

      const states = State.getStatesOfCountry(countryMeta.isoCode) || [];
      return states.map((state) => state.name);
    },
    enabled: !!country, // Only run query if country is selected
    retry: 1, // Limit retries
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
  });
};

// Fetch cities for a given country and state
export const useCities = (country, state) => {
  return useQuery({
    queryKey: ["cities", country, state],
    queryFn: async () => {
      if (!country || !state) return [];

      const countryMeta = findCountryMeta(country);
      if (!countryMeta?.isoCode) {
        console.warn("Country not found in dataset when fetching cities:", country);
        return [];
      }

      const states = State.getStatesOfCountry(countryMeta.isoCode) || [];
      const targetState = states.find(
        (stateObj) => normalizeValue(stateObj.name) === normalizeValue(state)
      );

      if (!targetState?.isoCode) {
        console.warn("State not found in dataset:", state, "for country:", country);
        return [];
      }

      const cities =
        City.getCitiesOfState(countryMeta.isoCode, targetState.isoCode) || [];
      return cities.map((city) => city.name);
    },
    enabled: !!country && !!state, // Only run query if both country and state are selected
    retry: 1, // Only retry once to avoid too many failed requests
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
  });
};
