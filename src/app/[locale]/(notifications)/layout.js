import UserHeader from "@/components/header/UserHeader";

export default function NotificationLayout({ children }) {
  return (
    <>
      <UserHeader />
      {children}
    </>
  );
}
