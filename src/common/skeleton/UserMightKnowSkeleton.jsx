import Card from "@/common/card/Card";

const UserMightKnowSkeleton = ({ isreq = false, isconnection = false }) => {
  return (
    <Card className="md:max-w-full md:w-full xl:max-w-[266px] sm:w-full">
      <h2
        className={`w-full bg-white rounded-t-[5px] text-base font-medium text-black text-left px-4 py-[15px] border-b-2 border-gray/50`}
      >
        <div className="w-44 h-3 bg-gray-300 rounded animate-pulse" />
      </h2>
      <div className="w-full py-4 flex flex-col gap-4 px-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
              <div className="text-left">
                <div className="w-24 h-3 bg-gray-300 rounded animate-pulse" />
                <div className="w-20 h-2 bg-gray-300 rounded mt-1 animate-pulse" />
              </div>
            </div>
            {!isconnection && (
              <div className="w-8 h-8 bg-gray-300 rounded-sm animate-pulse" />
            )}
            {isreq && (
              <div className="w-8 h-8 bg-gray-300 rounded-sm animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UserMightKnowSkeleton;
