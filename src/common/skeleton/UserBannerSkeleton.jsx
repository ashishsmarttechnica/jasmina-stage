import React from "react";

const UserBannerSkeleton = () => {
  return (
    <div className="xl:max-w-[829px] w-full rounded-md overflow-hidden">
      {/* Banner Skeleton */}
      <div className="bg-gray-100 animate-pulse px-4 sm:px-8 md:px-16 lg:px-24 py-6 rounded-[5px] flex items-center justify-between h-40 md:h-48 lg:h-56">
        <div className="flex items-center gap-2">
          <div className="w-[150px] sm:w-[180px] md:w-[200px] h-[50px] bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Profile Content Skeleton */}
      <div className="bg-white px-4 py-6 md:px-8 md:py-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left side skeleton */}
          <div className="px-2 w-full flex flex-col gap-2">
            <div className="h-7 w-40 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-5 w-32 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-4 w-28 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-9 w-28 bg-gray-100 animate-pulse rounded-md mt-2"></div>
          </div>

          {/* Right side skeleton */}
          <div className="flex flex-col items-end justify-center w-full">
            {/* Profile image skeleton */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-100 animate-pulse -mt-56 mr-0 md:mr-4 md:-mt-24"></div>

            {/* Stats skeleton */}
            <div className="flex border border-gray-100 mt-28 sm:mt-5 md:mt-4 w-full sm:max-w-xs xl:max-w-[266px] overflow-hidden rounded-md">
              <div className="py-4 px-2 w-1/2 border-r border-gray-100 text-center">
                <div className="h-6 w-14 bg-gray-100 animate-pulse rounded-md mx-auto"></div>
                <div className="h-4 w-24 bg-gray-100 animate-pulse rounded-md mx-auto mt-2"></div>
              </div>
              <div className="py-4 px-2 w-1/2 text-center">
                <div className="h-6 w-14 bg-gray-100 animate-pulse rounded-md mx-auto"></div>
                <div className="h-4 w-20 bg-gray-100 animate-pulse rounded-md mx-auto mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBannerSkeleton;
