const PlanCard = ({ title, dateRange, price, status }) => {
  return (
    <div className="flex w-full flex-col items-center rounded-lg border border-slate-300 bg-white p-4 shadow-md transition-all duration-200 hover:shadow-lg sm:p-6">
      <h3 className="mb-2 text-center text-sm font-medium text-[#888DA8] sm:text-base">{title}</h3>
      <p className="mb-3 text-center text-xs text-[#888DA8]/[70%] sm:text-sm">
        {dateRange}
      </p>
      {/* <p
        className={`mb-3 text-[12px] ${status === "pending" ? "text-yellow-600" : status === "completed" ? "text-green-600" : "text-red-600"}`}
      >
        Status: {status.charAt(0).toUpperCase() + status.slice(1)}
      </p> */}
      <div className="flex w-full justify-center">
        <span className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary/90 sm:px-6 sm:text-base">{price}</span>
      </div>
    </div>
  );
};

export default PlanCard;
