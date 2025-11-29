import Header from "@/components/header/Header";

export default function CompanyCreateLayout({ children }) {
  return (
    <>
      <Header isLogin={true} />
      {children}
    </>
  );
}
