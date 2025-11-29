import React from "react";

const CardHeading = ({ title, className = "" }) => {
  return (
    <h2
      className={`w-full bg-white rounded-t-[5px] text-base font-medium text-black text-left px-4 py-[15px] border-b-2 border-gray/50 ${className}`}
    >
      {title}
    </h2>
  );
};

export default CardHeading;
