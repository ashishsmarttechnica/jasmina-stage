import { BsThreeDotsVertical } from "react-icons/bs";
import { LuArrowLeft } from "react-icons/lu";

export default function ChatWindowHeader({ chat, onBack }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white p-2 px-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="md:hidden">
          <LuArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex flex-col">
          <div className="text-[13px] font-medium">{chat.name}</div>
          <div className="text-[14px] text-gray-500">{chat.role}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-md border border-transparent bg-[#CFE6CC] px-1 py-1 transition-colors duration-300 hover:border-[#0F8200] hover:bg-transparent">
          <BsThreeDotsVertical className="text-primary font-[14px]" />
        </button>
      </div>
    </div>
  );
}
