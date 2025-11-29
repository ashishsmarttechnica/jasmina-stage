import Logo from "@/assets/form/Logo.png";
import CreateJobTabMenu from "@/components/createJob/CreateJobTabMenu";
import { getSeoMeta } from "@/lib/seoMetadata";
import Image from "next/image";
export const metadata = getSeoMeta({
  title: "Create Job | Jasmina",
  path: "/create-job",
});

const page = () => {
  return (
    <div className="flex min-h-screen justify-center py-10">
      <div className="w-full">
        <div className="mb-2.5 flex items-center justify-center md:mt-4">
          <Image src={Logo} alt="Logo" width={206} height={53} />
        </div>
        <CreateJobTabMenu />
      </div>
    </div>
  );
};

export default page;
