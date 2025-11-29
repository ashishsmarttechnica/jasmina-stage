"use client";
import { useCreatePost } from "@/hooks/post/usePosts";
import getImg from "@/lib/getImg";
import CreateUserPost from "@/modal/CreateUserPost";
import useAuthStore from "@/store/auth.store";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { GoImage } from "react-icons/go";
import ImageFallback from "./shared/ImageFallback";
import PostCreationSkeleton from './skeleton/PostCreationSkeleton';

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const { user, isAuthLoading } = useAuthStore();
  const t = useTranslations('UserFeedPost')
  const [CompanyPostModalOpen, setCompanyPostModalOpen] = useState(false);
  const handleCompanyPostJob = () => setCompanyPostModalOpen(true);

  const fileInputRef = useRef(null);
  const { mutate: createPost, isPending } = useCreatePost();
  const [error, setError] = useState("");


  const [formData, setFormData] = useState({
    postText: "",
    previewImage: null,
    postImg: null,
    visibility: 1,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, postText }));
  }, [postText]);

  const handleSubmit = () => {
    setError("");

    // Validate: require either description or image
    if (!postText.trim() && !formData.postImg) {
      setError(t("postError"));
      return;
    }

    const data = new FormData();
    data.append("postDesc", postText);
    data.append("visible", formData.visibility);
    if (formData.postImg) {
      data.append("postImg", formData.postImg);
    }
    data.append("userId", user?._id || "");

    createPost(data, {
      onSuccess: () => {
        setPostText("");
        setFormData({
          postText: "",
          previewImage: null,
          postImg: null,
          visibility: 1,
        });
        setCompanyPostModalOpen(false);
      },
    });
  };

  if (isAuthLoading || !user) {
    return <PostCreationSkeleton />;
  }

  return (
    <div className="cust-card mb-4">
      <div className="border-b border-grayBlueText/50 py-4.5 pl-12 relative">
        <h2 className="text-primary font-medium text-sm">{t('doyourpost')}</h2>
        <div className="absolute -bottom-0 left-0 w-[181px] h-[2px] rounded-full bg-primary"></div>
      </div>

      <div className="flex items-center gap-3.5 px-4 pt-[15px] pb-5 border-b border-grayBlueText/50">
        <div className="relative">
          <div className="w-10 h-10">
            <ImageFallback
              src={user?.profile?.photo && getImg(user?.profile?.photo)}
              alt="user"
              width={40}
              height={40}
              className="rounded-full w-[40px] h-[40px] object-cover "
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-600 rounded-full border-2 border-white"></span>
        </div>
        <input
          placeholder={t('startpostPlaceholder')}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="text-grayBlueText text-[13px] font-medium p-2 w-full bg-transparent border-grayBlueText/50 rounded-md outline-none"
        />
      </div>

      <div className="flex items-center justify-between py-3.5 ps-7 pe-[17px]">
        <button
          className="flex items-center text-grayBlueText text-[13px] font-normal hover:text-green-600 gap-2"
          onClick={handleCompanyPostJob}
        >
          <GoImage className="w-4 h-4 text-grayBlueText" />
          <span>{t('media')}</span>
        </button>
        <button
          className="py-1 min-w-[85px] bg-primary hover:text-primary border border-primary hover:bg-transparent transition-all duration-75 ease-in text-white rounded-sm text-sm"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? t('posting') : t('post')}
        </button>
      </div>

      <CreateUserPost
        isOpen={CompanyPostModalOpen}
        onClose={() => setCompanyPostModalOpen(false)}
        postText={postText}
        setPostText={setPostText}
        userId={user?._id}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isPending={isPending}
        fileInputRef={fileInputRef}
        error={error}
      />
    </div>
  );
};


export default CreatePost;
