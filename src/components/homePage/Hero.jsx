"use client";
import leftImg from "@/assets/homePage/LeftBannerImage.png";
import rightImg from "@/assets/homePage/p3.png";
import Location from "@/assets/svg/homePage/Location";
import Search from "@/assets/svg/homePage/Search";
import { useSearchGlobalJobs } from "@/hooks/job/useSearchGlobalJobs";
import PostJobModal from "@/modal/PostJobModal";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Button } from "rsuite";
const Hero = () => {
  const router = useRouter();
  const [CompanyPostModalOpen, setCompanyPostModalOpen] = useState(false);
  const [ArrowModalOpen, setArrowModalOpen] = useState(false);
  const t = useTranslations("HomePage");


  const [searchValue, setSearchValue] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const { mutateAsync: searchJobs } = useSearchGlobalJobs();

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  const handleLocationChange = (e) => {
    setLocationValue(e.target.value);
  };





  const handleSearchClick = async () => {
    if (!searchValue.trim() && !locationValue.trim()) {
      toast.error("Please enter job title or location");
      return;
    }

    // Proceed with search
    console.log("Searching for:", searchValue, locationValue);

    try {
      const data = await searchJobs({
        search: searchValue,
        location: locationValue,
      });
      console.log("Final Search Result:", data);

      // Navigate to search job details page with search + location params
      router.push(
        `/searchjobdetails?search=${searchValue}&location=${locationValue}`
      );
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <section>
      <div className="mx-0 max-w-[1209px] px-5 xl:mx-auto">
        <div className="mt-2.5 mb-10 flex flex-col items-center justify-between gap-2 lg:flex-row xl:mt-[50px] xl:gap-16">
          <div className="hidden sm:block">
            <Image
              src={leftImg}
              alt="Banner 1"
              width={212}
              height={265}
              className="h-[265px] w-[212px] rounded-xl object-cover shadow-[0_10px_20px_rgba(0,_0,_0,_0.3)]"
            />
          </div>

          <div className="flex w-full flex-col items-center justify-center space-y-3 lg:w-1/2 xl:space-y-4">
            <div className="text-center">
              <h1 className="text-primary mx-auto mt-4 mb-4 max-w-sm text-[22px] font-bold md:text-[28px] lg:mt-10 lg:text-xl 2xl:text-[28px]">
                {t("hero.title")}
              </h1>
              <p className="text-grayBlueText mx-auto max-w-md text-lg md:text-xl lg:text-lg 2xl:text-xl">
                {t("hero.description")}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={() => setCompanyPostModalOpen(true)}
                className="!bg-secondary !text-primary text-decoration-none mb-3 rounded-md p-3 sm:p-2 sm:text-lg !text-[17px] font-medium sm:px-[14px] sm:py-3"
              >
                {t("hero.postaJob")}
              </Button>
            </div>


            <div className="mt-4 w-full max-w-2xl">
              <div className="flex flex-col gap-3 rounded-lg bg-white p-3 shadow-lg sm:flex-row sm:items-center p-2 sm:gap-4 sm:p-2 lg:gap-6 mb-4">
                <div className="flex flex-1 items-center gap-3 rounded-md sm:border sm:border-gray-200 border-none bg-gray-50 px-3 py-2 transition-colors focus-within:border-primary focus-within:bg-white sm:py-3">
                  <Search className="text-gray-500" />
                  <input
                    type="search"
                    onChange={handleSearchChange}
                    value={searchValue}
                    id='city'
                    name="search"
                    placeholder={t("hero.jobtitle")}
                    className="w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-500 sm:text-base"
                  />
                </div>

                <div className="hidden h-8 w-px bg-gray-300 sm:block"></div>

                <div className="flex flex-1 items-center gap-3 rounded-md sm:border sm:border-gray-200 border-none bg-gray-50 px-3 py-2 transition-colors focus-within:border-primary focus-within:bg-white sm:py-3">
                  <Location className="text-gray-500" />
                  <input
                    type="text"
                    onChange={handleLocationChange}
                    value={locationValue}
                    placeholder={t("hero.location")}
                    className="w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-500 sm:text-base"
                  />
                </div>

                <button
                  // onClick={() => setArrowModalOpen(true)}
                  onClick={handleSearchClick}
                  className="bg-primary flex items-center justify-center rounded-md p-1.5 text-white transition-all duration-200 hover:bg-primary/90 hover:scale-105 p-2 sm:p-3"
                >
                  <span className="text-sm mx-2 font-medium sm:hidden">Search</span><FaArrowRight className="text-sm sm:text-base" />
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-auto hidden sm:block ">
            <Image
              src={rightImg}
              alt="Banner 2"
              width={212}
              height={265}
              className="h-[265px] w-[212px] rounded-xl object-cover shadow-[0_10px_20px_rgba(0,_0,_0,_0.3)]"
            />
          </div>
        </div>
      </div>
      <PostJobModal
        isOpen={CompanyPostModalOpen}
        onClose={() => setCompanyPostModalOpen(false)}
        title={t("hero.model.title")}
        signUpPath={t("hero.model.SignUpPath")}
        cancelText={t("hero.model.Cancel")}
        signUpText={t("hero.model.SignUp")}
      />
      <PostJobModal
        isOpen={ArrowModalOpen}
        onClose={() => setArrowModalOpen(false)}
        title={t("hero.arrowModel.title")}
        signUpPath={t("hero.arrowModel.SignUpPath")}
        cancelText={t("hero.arrowModel.Cancel")}
        signUpText={t("hero.arrowModel.SignUp")}
      />
    </section>
  );
};

export default Hero;




