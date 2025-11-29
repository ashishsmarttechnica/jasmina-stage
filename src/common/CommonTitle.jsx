const CommonTitle = ({ title, className = "", right = null }) => {
  return (
    <div className={`w-full bg-white rounded-t-[5px] border-b-2 border-gray/50 ${className}`}>
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-[20px] font-medium text-black">{title}</h2>
        {right ? <div className="flex items-center gap-2">{right}</div> : null}
      </div>
    </div>
  );
};

export default CommonTitle;
