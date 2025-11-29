import React from "react";

const MainTitle = ({ title, subTitle }) => {
  return (
    <div className="mb-10">
      {title ? (
        <p className="text-center text-[24px] text-primery font-medium font-urbanist">
          {title}
        </p>
      ) : null}
      {subTitle ? (
        <p className="text-center text-[15px] text-grayBlueText font-normal">
          {subTitle}
        </p>
      ) : null}
    </div>
  );
};

export default MainTitle;
