import Uploadimg from "@/assets/form/Uploadimg.png";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import CropperModal from "./CropperModal";

const ImageUploader1 = ({
  selectedImage,
  setSelectedImage,
  setSelectedImageFile,
  isnotCEntered = false,
  isBanner = false,
  priority = false,
  error,
  enableCropping = false,
  aspectRatio = 1,
  isRounded = false,
  width = 128,
  height = 128,
  className = "",
}) => {
  const t = useTranslations("UserProfile.profile");
  const fileInputRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //  check file size (5 MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("sizeError"));
        e.target.value = "";
        return;
      }

      if (enableCropping) {
        // Show cropper modal
        setIsLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempImage(reader.result);
          setShowCropper(true);
          setIsLoading(false);
        };
        reader.onerror = () => {
          toast.error("Failed to load image");
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      } else {
        // Direct upload without cropping
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImageFile?.(file);
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCropSave = (croppedFile) => {
    console.log("Cropped file received:", croppedFile);
    setSelectedImageFile?.(croppedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("Cropped image data URL:", reader.result);
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(croppedFile);
    setShowCropper(false);
    setTempImage(null);
  };

  const handleCropperClose = () => {
    setShowCropper(false);
    setTempImage(null);
    setIsLoading(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className={`flex w-full flex-col ${isnotCEntered ? "" : "items-center justify-center"}`}>
        <div className="group relative">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div
            className={`relative flex ${isBanner ? "h-42 sm:w-1/2 rounded-xl" : "h-32 w-32"} cursor-pointer items-center justify-center overflow-hidden bg-white shadow-sm border border-gray-200 ${className} ${isLoading ? "opacity-50" : ""}`}
            style={{
              width: isBanner ? "auto" : `${width}px`,
              height: isBanner ? "auto" : `${height}px`,
            }}
            onClick={!isLoading ? handleImageClick : undefined}
          >
            <Image
              src={selectedImage || Uploadimg}
              alt="Upload Preview"
              fill
              sizes={isBanner ? "50vw" : "128px"}
              className="h-full w-full object-cover"
              priority={priority}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-sm">Loading...</div>
              </div>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Cropper Modal */}
      {enableCropping && (
        <CropperModal
          open={showCropper}
          onClose={handleCropperClose}
          image={tempImage}
          onCropSave={handleCropSave}
          aspect={aspectRatio}
          isRounded={isRounded}
        />
      )}
    </>
  );
};

export default ImageUploader1;
