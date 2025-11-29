import Chat from "@/assets/svg/homePage/Chat";
import { Heart } from "@/assets/svg/homePage/Heart";
import Meassge from "@/assets/svg/homePage/Meassge";
import { Plus } from "@/assets/svg/homePage/Plus";
import MainTitle from "@/common/MainTitle";
import { useTranslations } from "next-intl";
import React from "react";

const Connection = () => {
  const t = useTranslations("HomePage");
  return (
    <section className="py-8 bg-white px-2">
      <div className="container mx-auto">
        <MainTitle
          title={t("connection.title")}
          subTitle={
            t("connection.subtitle")
          }
        />

        <div className="grid 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
          <div className="pl-6 pr-6 pt-5 pb-5 shadow-sm bg-gray text-center rounded-xl">
            <div className="relative top-[-20px] start-[-20px] block">
              <div className="bg-primary p-9 rounded-md flex items-center justify-center w-[35px] h-[35px]">
                <Plus />
              </div>
            </div>
            <h5 className="text-[17px] font-medium mb-2 leading-[18px]">{t("connection.connect1.title")}</h5>
            <p className="text-[13px] text-grayBlueText m-0 leading-none">
              {t("connection.connect1.description")}
            </p>
          </div>

          <div className="p-5 shadow-sm bg-gray  text-center  rounded-xl">
            <div className="relative top-[-20px] start-[-20px] block ">
              <div className="bg-primary p-9 rounded-md flex items-center justify-center w-[35px] h-[35px]">
                <Heart />
              </div>
            </div>
            <h5 className="text-[17px] font-medium mb-2 leading-[18px]"> {t("connection.connect2.title")} </h5>
            <p className="text-[13px] text-grayBlueText m-0">
             {t("connection.connect2.description")}
            </p>
          </div>
          <div className="p-5 shadow-sm bg-gray  text-center  rounded-xl">
            <div className="relative top-[-20px] start-[-20px] block ">
              <div className="bg-primary p-9 rounded-md flex items-center justify-center w-[35px] h-[35px]">
                <Chat />
              </div>
            </div>
            <h5 className="text-[17px] font-medium mb-2 leading-[18px]">{t("connection.connect3.title")}</h5>
            <p className="text-[13px] text-grayBlueText m-0">
              {t("connection.connect3.description")}
            </p>
          </div>

          <div className="p-5 shadow-sm bg-gray  text-center  rounded-xl">
            <div className="relative top-[-20px] start-[-20px] block ">
              <div className="bg-primary p-9 rounded-md flex items-center justify-center w-[35px] h-[35px]">
                <Meassge />
              </div>
            </div>
            <h5 className="text-[17px] font-medium mb-2 leading-[18px]">{t("connection.connect4.title")}</h5>
            <p className="text-[13px] text-grayBlueText m-0">
              {t("connection.connect4.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connection;
