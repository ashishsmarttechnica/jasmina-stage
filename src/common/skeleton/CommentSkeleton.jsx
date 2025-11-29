import React from 'react';

const CommentSkeleton = () => {
  return (
    <div className="flex items-start gap-3 px-4 pb-5 border-b border-black/10 animate-pulse">
      {/* Profile Image with Online Indicator */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <span className="absolute -bottom-1 right-0 w-3 h-3 bg-gray-300 border-2 border-white rounded-full" />
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* User Name */}
        <div className="h-3 bg-gray-300 rounded w-24" />

        {/* Comment Text - Multiple Lines */}
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-4/5" />
          <div className="h-3 bg-gray-300 rounded w-2/3" />
        </div>

        {/* Comment Actions (Like, Reply, Time) */}
        <div className="flex items-center gap-4 pt-1">
          <div className="h-2.5 bg-gray-300 rounded w-8" />
          <div className="h-2.5 bg-gray-300 rounded w-10" />
          <div className="h-2.5 bg-gray-300 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;