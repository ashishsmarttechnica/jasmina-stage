// components/ReusableForm.js

const ReusableForm = ({
  title,
  subtitle,
  shorttitle,
  email,
  children,
  maxWidth = "sm:max-w-full md:max-w-[550px] lg:max-w-[585px]",
}) => {

  return (
    <div className="flex items-center justify-center ">
      <div className="container mx-auto">
        <div className="">
          <div
            className={`bg-white  rounded-[10px] px-4 py-3 sm:p-5 shadow-[0px_4px_25px_0px] shadow-grayBlueText/[20%]  ${maxWidth} mx-auto w-full`}
          >
            <div className="text-center ">
              <h2 className="font-medium text-[22px] mb-2.5 leading-[25px]  ">
                {title}
              </h2>
              <p className="text-[15px] font-semibold ">{shorttitle}</p>
              <p className="text-grayBlueText text-[13px] leading-[15px]">
                {subtitle}   {email && <span className="text-lightBlue"> {email}</span>}
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReusableForm;
