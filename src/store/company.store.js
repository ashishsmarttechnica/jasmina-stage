import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";

const useCompanyStore = create(
  devtools(
    (set) => ({
      token: null,
      company: null,
      setToken: (token) => set({ token }),
      setCompany: (user) => set({ user }),
      logout: () => {
        // Clear cookies
        Cookies.remove("token");
        Cookies.remove("userRole");
        Cookies.remove("isAuthenticated");
        Cookies.remove("profileCreated");
        Cookies.remove("userId");

        // Clear state
        set({ token: null, user: null });
      },
    }),
    {
      name: "CompanyStore",
    }
  )
);

export default useCompanyStore;
