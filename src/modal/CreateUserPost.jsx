import Uploadsmall from "@/assets/form/Uploadsmall.png";
import ImageFallback from "@/common/shared/ImageFallback";
import getImg from "@/lib/getImg";
import useAuthStore from "@/store/auth.store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "react-toastify";
import { Modal } from "rsuite";
const CreateUserPost = ({
  isOpen,
  formData,
  setFormData,
  isPending,
  onClose,
  postText,
  setPostText,
  handleSubmit,
  fileInputRef,
  error,
}) => {
  const handleImageClick = () => fileInputRef.current.click();
  const t = useTranslations("UserPostModel");
  const { user } = useAuthStore();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      postImg: file,
    }));

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("SizeError"));
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          previewImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVisibilityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      visibility: value,
    }));
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="sm"
      className="!max-h-[90vh] !w-[95%] overflow-hidden !p-0 sm:!max-h-[85vh] sm:!w-[90%] md:!w-[547px]"
    >
      <Modal.Body className="no-scrollbar h-full overflow-y-auto rounded-lg bg-white !p-1 sm:p-4 md:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <ImageFallback
              src={getImg(user?.profile?.photo)}
              alt="User"
              width={40}
              height={40}
              className="h-10 w-10 flex-shrink-0 rounded-full sm:h-12 sm:w-12"
            />
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-gray-800 sm:text-lg leading-relaxed break-words">
                {user?.profile?.fullName}
              </h3>
              <p className="mt-0.5 text-xs font-normal text-gray-600 sm:text-[13px] leading-relaxed break-words">
                {user?.preferences?.jobRole}
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary hover:bg-secondary hover:text-primary flex-shrink-0 rounded-md px-4 py-1.5 text-xs text-white transition disabled:opacity-60 sm:px-6 sm:py-2 sm:text-sm"
          >
            {isPending ? t("posting") : t("post")}
          </button>
        </div>
        <div className="w-full border-b border-gray-200"></div>

        <textarea
          placeholder={t("sharePlaceholder")}
          className="mt-3 h-20 w-full resize-none rounded-md p-2 text-sm placeholder:text-xs focus:border-blue-300 focus:ring focus:outline-none sm:p-3 sm:text-base sm:placeholder:text-[13px]"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />

        <div
          className="mt-3 flex h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded-md bg-gray-100 sm:mt-4 sm:h-[250px] md:h-[328px]"
          onClick={handleImageClick}
        >
          {formData.previewImage ? (
            <img
              src={formData.previewImage}
              alt="Preview"
              className="h-full w-full rounded-md object-contain"
            />
          ) : (
            <>
              <Image
                src={Uploadsmall}
                alt="Upload"
                width={32}
                height={32}
                className="sm:h-10 sm:w-10"
              />
              <button className="bg-primary hover:bg-secondary hover:text-primary mt-3 rounded-md px-3 py-1.5 text-xs text-white transition disabled:opacity-60 sm:mt-4 sm:px-4 sm:py-2 sm:text-[13px]">
                {t("uploadmedia")}
              </button>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm ">{error}</p>
        )}
        {/* <div className="mt-6 sm:mt-8">
          <h4 className="text-grayBlueText mb-3 text-xs font-medium sm:text-sm">{t("whopost")}</h4>
          <div className="space-y-1">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md p-2 transition-colors hover:bg-gray-50">
              <div className="relative">
                <input
                  type="radio"
                  name="visibility"
                  value={1}
                  checked={formData.visibility === 1}
                  onChange={() => handleVisibilityChange(1)}
                  className="peer sr-only"
                />
                <div className="peer-checked:border-primary flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300">
                  <div
                    className={`h-2 w-2 rounded-full ${formData.visibility === 1 ? "bg-primary" : "bg-transparent"} transition-colors`}
                  ></div>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-800 sm:text-sm">{t("Anyone")}</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-md p-2 transition-colors hover:bg-gray-50">
              <div className="relative">
                <input
                  type="radio"
                  name="visibility"
                  value={0}
                  checked={formData.visibility === 0}
                  onChange={() => handleVisibilityChange(0)}
                  className="peer sr-only"
                />
                <div className="peer-checked:border-primary flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300">
                  <div
                    className={`h-2 w-2 rounded-full ${formData.visibility === 0 ? "bg-primary" : "bg-transparent"} transition-colors`}
                  ></div>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-800 sm:text-sm">
                {t("connectionsonly")}
              </span>
            </label>
          </div>
        </div> */}

      </Modal.Body>
    </Modal>
  );
};

export default CreateUserPost;
