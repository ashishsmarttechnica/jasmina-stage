import React from 'react'

const UserActivitySkeleton = () => {
    return (
        <div className="animate-pulse">
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="min-w-[365px] bg-white rounded-[5px] shadow-card border border-secondary/20">
                <div className="flex items-center gap-2.5 py-[17px] px-[17px] border-b border-black/10">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="p-[17px]">
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6 mb-4"></div>
                  <div className="h-48 bg-gray-300 rounded w-full"></div>
                </div>
                <div className="flex justify-between items-center p-[17px] border-t border-black/10">
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}

export default UserActivitySkeleton