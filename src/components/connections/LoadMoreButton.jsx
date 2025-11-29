const LoadMoreButton = ({ onClick, isLoading }) => (
  <div className="mt-4 flex justify-center">
    <button
      onClick={onClick}
      disabled={isLoading}
      className="text-primary border-primary hover:bg-primary flex items-center gap-2 rounded border px-4 py-2 text-sm transition hover:text-white"
    >
      {isLoading ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading</span>
        </>
      ) : (
        "Load More"
      )}
    </button>
  </div>
);

export default LoadMoreButton;
