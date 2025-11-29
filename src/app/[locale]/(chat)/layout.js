import UserHeader from "@/components/header/UserHeader";

export default function ChatLayout({ children }) {
  return (
    <>
      <UserHeader />
      {children}
    </>
  );
}
