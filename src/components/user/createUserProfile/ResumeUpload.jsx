"use client";
import ReusableForm from "@/components/form/ReusableForm";
import useUpdateProfile from "@/hooks/user/useUpdateProfile";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/store/auth.store";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Loader } from "rsuite";

const ResumeUpload = ({ setActiveTab, activeTab, draftFile, setDraftFile, draftFileName, setDraftFileName }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(draftFile || null);
  const [error, setError] = useState("");
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const t = useTranslations("UserProfile.resume");
  const hasRealSavedResume = Boolean(
    user?.resume &&
      typeof user.resume === "string" &&
      !user.resume.toLowerCase().includes("resume-sample.pdf")
  );
  const {
    mutate: updateProfile,
    isPending,
    error: apiError,
  } = useUpdateProfile();

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t("fileSizeError"));
        event.target.value = "";
        return;
      }
      setSelectedFile(file);
      if (typeof setDraftFile === "function") setDraftFile(file);
      if (typeof setDraftFileName === "function") setDraftFileName(file.name);
      setError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // ✅ User already has resume and not uploading a new one
    // if (!selectedFile && user?.resume) {
    //   setActiveTab(4);
    //   return;
    // }

    // ❌ No resume and no file selected
    // if (!selectedFile && !user.resume) {
    //   setError(t("resumeError"));
    //   return;
    // }

    const validExtensions = [".pdf", ".doc", ".docx", ".tex", ".webp"];
    const fileExtension = selectedFile?.name.split(".").pop();

    if (selectedFile && !validExtensions.includes(`.${fileExtension.toLowerCase()}`)) {
      setError(t("fileError"));
      return;
    }

    const submitData = new FormData();
    submitData.append("resume", selectedFile);
    submitData.append("steps", activeTab + 1);

    updateProfile(submitData, {
      onSuccess: (res) => {
        if (res.success) {
          setActiveTab(activeTab + 1);
        }
      },
    });
  };

  const onSkipClick = () => {
    setActiveTab(activeTab + 1);
  };
  return (
    <ReusableForm
      title={t("title")}
      maxWidth="max-w-[698px]"
      subtitle={t("subTitle")}
    >
      <form className="space-y-2 mt-5" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center">
          <div className="shadow-[0px_4px_25px_0px_rgba(136,141,168,0.20)] border border-black/5 bg-white px-10 sm:px-14  py-4 rounded-[10px] mt-5">
            <p className="text-grayBlueText mt-5">{`${t("description")}*`}</p>
            <div className="flex flex-col items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.tex"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="btn-fill max-w-[210px]"
                onClick={handleFileButtonClick}
              >
                {t("Upload")}
              </button>
              <div className="mt-5">
                {selectedFile ? (
                  <p className="text-sm text-gray-600 ">{selectedFile.name}</p>
                ) : draftFile ? (
                  <p className="text-sm text-gray-600 ">{draftFileName}</p>
                ) : hasRealSavedResume ? (
                  <p className="text-sm text-gray-600 "> {t("Uploaded")} </p>
                ) : (
                  <p className="text-sm text-gray-500 ">Upload resume here</p>
                )}
                {error && <p className="text-sm text-red-500 ">{error}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Back */}
          <div className="block space-y-4">
            {activeTab > 0 && (
              <button
                type="button"
                className="btn-white-fill"
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={isPending}
              >
                {t("Back")} <span className="text-[20px]">&lt;</span>
              </button>
            )}
          </div>

          {/* Skip */}
          <div className="block space-y-4">
            <button
              type="button"
              className="btn-white-fill"
              onClick={onSkipClick}
              disabled={isPending}
            >
              <>
                {t("Skip")} <span className="text-[20px]">&#187;</span>
              </>
            </button>
          </div>

          {/* Next */}
          <div className="block space-y-4">
            <button type="submit" className="btn-fill" disabled={isPending}>
              {isPending ? (
                <div>
                  <Loader inverse />
                </div>
              ) : (
                <>
                  <div className="text-[20px]">{t("Next")}</div>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </ReusableForm>
  );
};

export default ResumeUpload;
