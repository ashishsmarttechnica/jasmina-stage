import React from "react";

const SingleUserTabSkeleton = () => {
  return (
    <div className="bg-white shadow rounded-[5px] animate-pulse">
      {/* Tab Header Skeleton */}
      <div className="relative hidden sm:flex gap-3 sm:gap-6 px-3 border-b border-black/10 text-[14px] font-medium text-gray-500 py-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="py-3.5 w-20 h-6 bg-gray-300 rounded"></div>
        ))}
        <div className="absolute -bottom-0.5 h-[3px] w-20 bg-gray-300"></div>
      </div>

      {/* Mobile Dropdown Skeleton */}
      <div className="sm:hidden p-4">
        <div className="relative">
          <div className="w-full h-12 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="flex flex-col gap-2">
            <div className="h-5 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col gap-2">
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col gap-2">
            <div className="h-5 bg-gray-300 rounded w-2/5"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserTabSkeleton;
