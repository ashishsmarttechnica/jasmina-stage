import UserHeader from "@/components/header/UserHeader";

export default function UserLayout({ children }) {
  return (
    <>
      <UserHeader />
      {children}
    </>
  );
}
