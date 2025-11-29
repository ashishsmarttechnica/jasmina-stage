// components/form/PasswordField.js
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  show,
  toggle,
  error,
  autocomplete = "current-password",
}) => (
  <div className="my-2.5">
    <label className="text-grayBlueText text-[15px]">{label}</label>
    <div className="relative mt-1">
      <input
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="border-lightGray/75 focus:ring-primary hover:border-primary hover:bg-primary/5 active:bg-primary/10 undefined w-full rounded border p-2 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-1 focus:outline-none"
        autoComplete={autocomplete}
      />
      <div className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggle}>
        {show ? (
          <FiEye className="text-[18px] sm:text-[20px]" />
        ) : (
          <FiEyeOff className="text-[18px] text-gray-500 sm:text-[20px]" />
        )}
      </div>
    </div>
    {error && <span className="text-sm text-red-500">{error}</span>}
  </div>
);

export default PasswordField;
