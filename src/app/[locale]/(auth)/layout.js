import Logo from "@/assets/form/Logo.png";
import Header from "@/components/header/Header";
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <>
      <Header />
      <div className="flex justify-center py-8">
        <div className="w-full">
          <div className="flex items-center justify-center md:mt-4 mb-2.5">
            <Image src={Logo} alt="Logo" width={206} height={53} />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
