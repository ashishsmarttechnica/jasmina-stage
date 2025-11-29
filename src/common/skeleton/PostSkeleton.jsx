const PostSkeleton = ({ count = 1 }) => {
  return (
    <div className="w-full space-y-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div className="bg-white rounded-xl  animate-pulse shadow-card" key={index}>
            {/* Header Section - User Info */}
            <div className="flex items-center gap-2.5 py-4 px-5 pb-[16px] border-b border-black/10">
              {/* Profile Image Skeleton */}
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>

              {/* User Details Skeleton */}
              <div className="text-left min-w-0 flex-1">
                <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-2.5 bg-gray-300 rounded w-16"></div>
              </div>
            </div>

            {/* Post Content Section */}
            <div className="px-6 py-1">
              {/* Post Description Skeleton */}
              <div className="pt-5 pb-4 space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                <div className="h-3 bg-gray-300 rounded w-3/5"></div>
              </div>

              {/* Post Image Skeleton */}
              <div className="overflow-hidden mb-4">
                <div className="w-full h-[300px] bg-gray-300 rounded max-h-[514px]"></div>
              </div>
            </div>

            {/* Footer Section - Actions */}
            <div className="flex justify-between items-center text-[13px] border-t py-4 px-4 border-black/10">
              {/* Action Buttons Skeleton */}
              <div className="flex gap-5 items-center flex-wrap">
                {/* Like Button Skeleton */}
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-6"></div>
                </div>

                {/* Comment Button Skeleton */}
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-6"></div>
                </div>

                {/* Share Button Skeleton */}
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-6"></div>
                </div>
              </div>

              {/* Time Skeleton */}
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PostSkeleton;
