import UserHeader from "@/components/header/UserHeader";

export default function CompanyLayout({ children }) {
  
  return (
    <>
      <UserHeader />

      {children}
    </>
  );
}
