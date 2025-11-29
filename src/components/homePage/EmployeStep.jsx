import EmployeStep1 from "@/assets/homePage/EmployeStep.png";
import Bag from "@/assets/svg/homePage/Bag";
import HandSake from "@/assets/svg/homePage/HandSake";
import Learn from "@/assets/svg/homePage/Learn";
import Letter from "@/assets/svg/homePage/Letter";
import MainTitle from "@/common/MainTitle";
import { useTranslations } from "next-intl";
import Image from "next/image";

const EmployeStep = () => {
  const t = useTranslations("HomePage");
  return (
    <section className="mt-5 mb-10 sm:mt-10 xl:mt-32">
      <div className="container mx-auto px-2 sm:px-0">
        <MainTitle title={t("employeSteps.title")} subTitle={t("employeSteps.subtitle")} />
        <div className="mt-10">
          <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
            <div>
              <Image src={EmployeStep1} alt="EmployeStep" width={450} height={300} />
            </div>
            <div className="space-y-7">
              <div className="flex items-start justify-start gap-3">
                <div className="icon">
                  <HandSake />
                </div>
                <div className="block">
                  <h4 className="mb-1 text-[17px] leading-[18px] font-medium">
                    {t("employeStep.step1.title")}
                  </h4>
                  <p className="text-grayBlueText text-[13px]">
                    {t("employeStep.step1.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-start gap-3">
                <div className="icon">
                  <Bag />
                </div>
                <div className="block">
                  <h4 className="mb-1 text-[17px] leading-[18px] font-medium">
                    {t("employeStep.step2.title")}
                  </h4>
                  <p className="text-grayBlueText text-[13px]">
                    {t("employeStep.step2.description")}
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-start gap-3">
                <div className="icon">
                  <Letter />
                </div>
                <div className="block">
                  <h4 className="mb-1 text-[17px] leading-[18px] font-medium">
                    {t("employeStep.step3.title")}
                  </h4>
                  <p className="text-grayBlueText text-[13px]">
                    {t("employeStep.step3.description")}
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-start gap-3">
                <div className="icon">
                  <Learn />
                </div>
                <div className="block">
                  <h4 className="mb-1 text-[17px] leading-[18px] font-medium">
                    {t("employeStep.step4.title")}
                  </h4>
                  <p className="text-grayBlueText text-[13px]">
                    {t("employeStep.step4.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeStep;
