const ErrorDisplay = ({ error, refetchFn }) => (
  <div className="p-4 text-center text-red-500 sm:p-6">
    <p>Error: {error?.message || "Something went wrong"}</p>
    <button
      onClick={refetchFn}
      className="text-primary border-primary hover:bg-primary mt-2 rounded border px-4 py-2 text-sm transition hover:text-white"
    >
      Try Again
    </button>
  </div>
);

export default ErrorDisplay;
