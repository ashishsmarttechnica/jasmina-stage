import noImage2 from "@/assets/form/noImage2.svg";
import ImageFallback from "@/common/shared/ImageFallback";
import { useRouter } from "@/i18n/navigation";
import capitalize from "@/lib/capitalize";
import getImg from "@/lib/getImg";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const getItemConfig = (comment, role) => {
  if (role === "Company") {
    return {
      name: comment?.user?.companyName || "Unknown",
      image: comment?.user?.logoUrl ? getImg(comment.user.logoUrl) : noImage2,
    };
  } else {
    return {
      name: comment?.user?.profile?.fullName || "Unknown",
      image: comment?.user?.profile?.photo ? getImg(comment.user.profile.photo) : noImage2,
    };
  }
};

const CommentItem = ({ comment }) => {
  const userRole = Cookies.get("userRole");
  const config = getItemConfig(comment, capitalize(comment.userType));
  const router = useRouter();

  const handleUserProfile = (singleComment) => {
    if (singleComment.userType === "Company") {
      if (singleComment.user?._id) {
        router.push(`/company/single-company/${singleComment.user._id}?fromConnections=true`);
      } else {
        toast.error(t("Companynotfound"));
      }
    } else {
      if (singleComment.user?._id) {
        router.push(`/single-user/${singleComment.user._id}?fromConnections=true`);
      } else {
        toast.error(t("Usernotfound"));
      }
    }
  };

  return (
    <div className="flex items-start gap-3 px-4 pb-5" key={comment._id}>
      <div className="relative cursor-pointer" onClick={() => handleUserProfile(comment)}>
        <ImageFallback
          src={config.image}
          alt={config.name || "noImage2"}
          width={32}
          height={32}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="cursor-pointer text-[13px] font-medium capitalize"
          onClick={() => handleUserProfile(comment)}
        >
          {config.name}
        </div>
        <p className="text-grayBlueText mt-0.5 text-xs font-normal">{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentItem;
