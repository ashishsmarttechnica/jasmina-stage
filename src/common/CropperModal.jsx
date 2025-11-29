import React, { useRef, useState, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Modal, Button } from "rsuite";
import { useTranslations } from "next-intl";

const CropperModal = ({
  open,
  onClose,
  image,
  onCropSave,
  aspect = 1,
  isRounded = false,
  fileSize = null,
}) => {
  const t = useTranslations("UserProfile.profile");
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();

  // Reset state when modal closes
  const handleClose = () => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    onClose();
  };

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }, [aspect]);

  const getCroppedImg = (image, crop, fileName = "cropped-image.png") => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      Math.floor(crop.x * scaleX),
      Math.floor(crop.y * scaleY),
      Math.floor(crop.width * scaleX),
      Math.floor(crop.height * scaleY),
      0,
      0,
      Math.floor(crop.width * scaleX),
      Math.floor(crop.height * scaleY)
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          blob.name = fileName;
          resolve(blob);
        },
        "image/png",
        0.9
      );
    });
  };

  const handleCropSave = async () => {
    if (!completedCrop || !imgRef.current) {
      console.error("No crop data available");
      return;
    }

    // Check if original file size exceeds 5MB
    if (fileSize && fileSize > 5 * 1024 * 1024) {
      return; // Don't save if file is too large
    }

    try {
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop,
        "cropped-image.png"
      );

      const file = new File([croppedImageBlob], "cropped-image.png", {
        type: "image/png",
        lastModified: Date.now(),
      });

      onCropSave(file);
      handleClose();
    } catch (error) {
      console.error("Error during crop save:", error);
    }
  };

  const isFileTooLarge = fileSize && fileSize > 5 * 1024 * 1024;

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      size="sm" 
      backdrop="static"
      className="!mx-2 sm:!mx-auto"
    >
      <Modal.Header className="px-3 py-2 sm:px-4 sm:py-3">
        <Modal.Title className="text-base sm:text-lg">Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 py-3 sm:px-4 sm:py-4">
        <div className="w-full mb-3">
          {isFileTooLarge && (
            <div className="mb-3 sm:mb-4 rounded-md border border-red-300 bg-red-50 p-2.5 sm:p-3">
              <p className="text-xs sm:text-sm text-red-600 leading-relaxed">{t("sizeError")}</p>
            </div>
          )}
          {image && (
            <div className="flex justify-center overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                circularCrop={isRounded}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={image}
                  style={{ maxHeight: "300px", maxWidth: "100%" }}
                  className="max-h-[300px] sm:max-h-[400px] w-auto"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="px-3 py-2 sm:px-4 sm:py-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button 
          appearance="primary" 
          onClick={handleCropSave}
          disabled={!completedCrop || isFileTooLarge}
          className="w-full sm:w-auto min-h-[44px] sm:min-h-0"
        >
          Crop & Save
        </Button>
        <Button 
          appearance="subtle" 
          onClick={handleClose}
          className="w-full sm:w-auto min-h-[44px] sm:min-h-0"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CropperModal;
    