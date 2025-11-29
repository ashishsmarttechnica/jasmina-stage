import { create } from "zustand";

const useLocationStore = create((set) => ({
  selectedCountry: "",
  selectedCountryCode: "",
  selectedState: "",
  selectedCity: "",

  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setSelectedCountryCode: (code) => set({ selectedCountryCode: code }),
  setSelectedState: (state) => set({ selectedState: state }),
  setSelectedCity: (city) => set({ selectedCity: city }),

  resetLocation: () =>
    set({
      selectedCountry: "",
      selectedCountryCode: "",
      selectedState: "",
      selectedCity: "",
    }),
}));

export default useLocationStore;
