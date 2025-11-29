
const JobTypeButton = ({ label, value, selectedValue, onClick, error }) => {
  return (
    <button
      type="button"
      className={`w-full max-w-[120px] text-sm break-words whitespace-normal text-center shadow-[0px_4px_25px_0px_rgba(136,141,168,0.20)] border border-black/10 text-black px-2 py-1 rounded hover:bg-secondary hover:text-black transition-all duration-300 ${selectedValue === value ? "bg-primary/75 text-white" : "bg-white"
        }`}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
};


export default JobTypeButton;
