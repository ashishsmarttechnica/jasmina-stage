import Header from "@/components/header/Header";

export default function UserCreateLayout({ children }) {
  return (
    <>
      <Header isLogin={true} />
      {children}
    </>
  );
}
