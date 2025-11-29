import React from 'react'

const PostCreationSkeleton = () => {
  return (
     <div className="cust-card mb-4 animate-pulse">
      {/* Header Section */}
      <div className="border-b border-grayBlueText/50 py-4.5 pl-12 relative">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="absolute -bottom-0 left-0 w-[181px] h-[2px] rounded-full bg-gray-300"></div>
      </div>

      {/* Input Section */}
      <div className="flex items-center gap-3.5 px-4 pt-[15px] pb-5 border-b border-grayBlueText/50">
        {/* Profile Image Skeleton */}
        <div className="relative">
          <div className="w-[40px] h-[40px] bg-gray-300 rounded-full"></div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-300 rounded-full border-2 border-white"></span>
        </div>

        {/* Input Field Skeleton */}
        <div className="w-full">
          <div className="h-9 bg-gray-300 rounded-md w-full"></div>
        </div>
      </div>

      {/* Bottom Actions Section */}
      <div className="flex items-center justify-between py-3.5 ps-7 pe-[17px]">
        {/* Media Button Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>

        {/* Post Button Skeleton */}
        <div className="h-7 bg-gray-300 rounded-sm w-[85px]"></div>
      </div>
    </div>
  )
}

export default PostCreationSkeleton