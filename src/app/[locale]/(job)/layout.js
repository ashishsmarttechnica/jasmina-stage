import UserHeader from "@/components/header/UserHeader";

export default function JobLayout({ children }) {
  return (
    <>
      <UserHeader />
      {children}
    </>
  );
}
