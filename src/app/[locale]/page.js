import Connection from "@/components/homePage/Connection";
import EmployeStep from "@/components/homePage/EmployeStep";
import Hero from "@/components/homePage/Hero";
import HeroProfileImg from "@/components/homePage/HeroProfileImg";
import Popular from "@/components/homePage/Popular";
import { useTranslations } from "next-intl";
import { getSeoMeta } from "@/lib/seoMetadata";
import Header from "@/components/header/Header";

export const metadata = getSeoMeta({
  title: "Jasmina | Home",
  path: "/",
});

// Client component starts here
export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <>
      <Header />

      <Hero />
      <HeroProfileImg />
      <EmployeStep />
      <Connection />
      <Popular />
    </>
  );
}
