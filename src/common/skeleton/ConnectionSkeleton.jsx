const PeopleCardSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col justify-between border-b border-black/10 bg-white px-2 py-4 sm:flex-row sm:items-center">
      {/* Avatar and Info Skeleton */}
      <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto">
        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300" />
        <div className="min-w-0 flex-1 space-y-2">
          {/* Name */}
          <div className="h-4 w-32 rounded bg-gray-300 sm:w-40" />
          {/* Job Title */}
          <div className="h-3 w-24 rounded bg-gray-300 sm:w-32" />
          {/* Location */}
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-gray-300" />
            <div className="h-3 w-20 rounded bg-gray-300 sm:w-28" />
          </div>
        </div>
      </div>

      {/* Button and Date Skeleton */}
      <div className="mt-3 flex w-full flex-col gap-2 sm:mt-0 sm:w-auto sm:min-w-[140px] sm:flex-row sm:items-center sm:gap-3">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <div className="h-8 w-full rounded bg-gray-300 sm:h-8 sm:w-16" />
          <div className="h-8 w-full rounded bg-gray-300 sm:h-8 sm:w-16" />
        </div>
        <div className="mx-auto h-3 w-20 rounded bg-gray-300 sm:mx-0 sm:w-24" />
      </div>
    </div>
  );
};

const ConnectionsSkeleton = ({ count = 5 }) => {
  return (
    <div className="animate-pulse rounded-md bg-white shadow">
      {/* Header */}
      <div className="z-10 bg-white">
        <div className="border-b border-black/10">
          <div className="px-3 py-3 sm:px-6 sm:py-4">
            <div className="h-5 w-32 rounded bg-gray-300 sm:h-6 sm:w-44" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 overflow-x-auto border-b border-black/10 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3.5">
          <div className="h-4 w-16 flex-shrink-0 rounded bg-gray-300 sm:h-5 sm:w-20" />
          <div className="h-4 w-20 flex-shrink-0 rounded bg-gray-300 sm:h-5 sm:w-24" />
          <div className="h-4 w-14 flex-shrink-0 rounded bg-gray-300 sm:h-5 sm:w-16" />
        </div>
      </div>

      {/* People List Skeleton */}
      <div className="px-2 sm:px-6">
        {Array.from({ length: count }, (_, index) => (
          <PeopleCardSkeleton key={index} />
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="border-t border-black/10 px-3 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto h-8 w-24 rounded bg-gray-300 sm:h-9 sm:w-28" />
      </div>
    </div>
  );
};

export default ConnectionsSkeleton;
