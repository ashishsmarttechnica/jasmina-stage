"use client";
import { useLocationQuery } from "@/api/location.api";
import useLocationStore from "@/store/location.store";
import { useTranslations } from "next-intl";
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";

const LocationInput = ({ value, onChange, onLocationDetect, isDesable }) => {
  const [loading, setLoading] = useState(false);
  const t=useTranslations("UserProfile.profile");
  const [isLocationDetected, setIsLocationDetected] = useState(false);
  const setLocation = useLocationStore((state) => state.setLocation);
  const {
    setCity,
    setStateDistrict,
    setState,
    setCountry,
  } = useLocationStore();
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const { data, isLoading } = useLocationQuery(
    coordinates.latitude,
    coordinates.longitude
  );

  const updateLocationData = useCallback((locationData) => {
    if (!locationData?.address) return null;

    const { address } = locationData;
    const city = address.city || address.town || address.village || "";
    const stateDistrict = address.state_district || "";
    const state = address.state || "";
    const country = address.country || "";

    const fullLocation = [city, stateDistrict, state, country]
      .filter(Boolean)
      .join(", ");

    // Update location state in Zustand
    setLocation(fullLocation);
    setCity(city);
    setStateDistrict(stateDistrict);
    setState(state);
    setCountry(country);

    return { fullLocation, city, stateDistrict, state, country };
  }, [setLocation, setCity, setStateDistrict, setState, setCountry]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setIsLocationDetected(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        setLoading(false);
      },
      (error) => {
        toast.error(`${t("locationPermission")} ${error.message}`);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (data && !isLocationDetected) {
      const locationData = updateLocationData(data);
      if (locationData) {
        setIsLocationDetected(true);
        if (onChange) {
          onChange(locationData.fullLocation);
        }
        if (onLocationDetect) {
          onLocationDetect({
            city: locationData.city,
            stateDistrict: locationData.stateDistrict,
            state: locationData.state,
            country: locationData.country
          });
        }
      }
    }
  }, [data, isLocationDetected, onChange, onLocationDetect, updateLocationData]);

  return (
    <div className="space-y-1">
      <label className="text-[14px] text-grayBlueText">{`${t("location")} *`}</label>
      <div className="flex gap-2">
        <input
          type="text"
          name="location"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("locationPlaceholder")}
          className="border border-lightGray/75 p-2 rounded w-full  transition-all duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent hover:border-primary hover:bg-primary/5 active:bg-primary/10"
          disabled={isDesable || isLocationDetected}
        />
        {/* <button
          type="button"
          onClick={detectLocation}
          disabled={loading || isLoading || isLocationDetected}
          className="border border-lightGray/[75%] px-3 rounded-md text-sm bg-lightWhite hover:bg-gray transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || isLoading ? `${t("locationDetecting")}` : `${t("locationDetect")}`}
        </button> */}
      </div>
    </div>
  );
};

export default LocationInput;
