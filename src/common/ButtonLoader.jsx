import { Loader } from "rsuite";

const ButtonLoader = ({ label, isPending, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      disabled={isPending}
      className={`w-full p-1 sm:p-2 bg-primary text-white rounded-md sm:text-xl text-[18px] leading-[27px] flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    >
      {isPending ? <div><Loader inverse /></div> : label}
    </button>
  );
};

export default ButtonLoader;
