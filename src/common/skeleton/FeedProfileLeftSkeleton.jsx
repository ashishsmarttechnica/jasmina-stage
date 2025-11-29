import React from "react";
import Card from "../card/Card";

const FeedProfileLeftSkeleton = () => {
  return (
    <Card className="md:max-w-full md:w-full xl:max-w-[266px] animate-pulse">
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="rounded-full bg-gray-300 w-[130px] h-[130px] mb-8" />
        <div className="bg-gray-300 h-4 w-[100px] rounded mb-2" />
        <div className="bg-gray-300 h-3 w-[80px] rounded" />
      </div>

      <div className="flex justify-around w-full border-y border-black/10">
        <div className="w-1/2 text-center border-r border-black/10 py-4">
          <div className="h-4 w-[30px] bg-gray-300 rounded mx-auto mb-1" />
          <div className="h-3 w-[60px] bg-gray-300 rounded mx-auto" />
        </div>
        <div className="w-1/2 text-center py-4">
          <div className="h-4 w-[30px] bg-gray-300 rounded mx-auto mb-1" />
          <div className="h-3 w-[60px] bg-gray-300 rounded mx-auto" />
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="h-[30px] w-[120px] bg-gray-300  mx-auto" />
      </div>
    </Card>
  );
};

export default FeedProfileLeftSkeleton;
