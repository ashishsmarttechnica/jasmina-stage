const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  min,
  max,
  step,
  onInput,
  disabled,
  textarea = false,
  rows = 4,
  inputClassName,
  parentClassName,
  autoComplete,
}) => {
  return (
    <div className={`space-y-1 ${parentClassName}`}>
      {label && (
        <label className="text-grayBlueText mb-1 block text-[14px]" htmlFor={name}>
          {label}
        </label>
      )}

      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onInput={onInput}
          placeholder={placeholder}
          disabled={disabled}
          className="border-lightGray/75 focus:ring-primary hover:border-primary hover:bg-primary/5 active:bg-primary/10 w-full resize-none rounded border p-2 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-1 focus:outline-none"
        />
      ) : (
        <input
          id={name}
          type={type}
          max={max}
          min={min}
          step={step}
          name={name}
          className={`border-lightGray/75 focus:ring-primary hover:border-primary hover:bg-primary/5 active:bg-primary/10 w-full rounded border p-2 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-1 focus:outline-none ${inputClassName}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onInput={onInput}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
