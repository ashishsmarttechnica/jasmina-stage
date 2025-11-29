import noImage2 from "@/assets/feed/no-img.png";
import logo from "@/assets/form/Logo.png";
import Flag from "@/assets/svg/user/Flag";
import ImageFallback from "@/common/shared/ImageFallback";
import UserBannerSkeleton from "@/common/skeleton/UserBannerSkeleton";
import { useCreateConnection, useRemoveConnection } from "@/hooks/connections/useConnections";
import { useAcceptConnection, useRejectConnection } from "@/hooks/user/useNetworkInvites";
import getImg from "@/lib/getImg";
import EdicCompanyProfileModal from "@/modal/editCompanyProfile/EdicCompanyProfileModal";
import PasswordResetModal from "@/modal/passwordReset/PasswordResetModal";
import Cookies from "js-cookie";
import { useLocale, useTranslations } from "next-intl";
// import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useParams, useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
import Share from "@/assets/svg/feed/Share";
import { useGenerateChatRoom } from "@/hooks/chat/useGenerateChatRoom";
import ReportModel from "@/modal/ReportModel";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import galleryIcon from "@/assets/gallery.png";
import Swal from "sweetalert2";

const CompanyBannerProfile = ({ userData, isLoading, forceFromConnectionRequest = false }) => {
  // console.log(userData)
  const t = useTranslations("CompanyProfile.singleCompany");
  const params = useParams();
  const paramsUserId = params?.id;
  const locale = useLocale();

  const localUserId = Cookies.get("userId");
  const isCurrentUser = paramsUserId === localUserId;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromConnectionRequest = searchParams?.get("fromConnectionRequest") === "true";
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: acceptInvitation, isPending: isAccepting } = useAcceptConnection();
  const { mutate: rejectInvitation, isPending: isRejecting } = useRejectConnection();
  const {
    mutate: createConnection,
    isPending,
    isLoading: isCreateConnectionLoading,
  } = useCreateConnection();
  const [isShareLoading, setIsShareLoading] = useState(false);
  const { mutate: generateChatRoom, isPending: isGeneratingChat } = useGenerateChatRoom();
  const [didSendRequest, setDidSendRequest] = useState(false);

  const { mutate: removeConnection } = useRemoveConnection();

  const isConnected = userData?.connectionStatus;
  console.log(userData, "userDatauserData");

  console.log(isConnected, "user isConnected");
  // console.log(isConnected, "user isConnected")
  const [connectionStatus, setConnectionStatus] = useState("not connected");
  // console.log(connectionStatus, "connectionStatus");

  // keep in sync with userData when it changes
  useEffect(() => {
    // console.log("Raw status from API:", userData?.connectionStatus);
    if (userData?.connectionStatus) {
      setConnectionStatus(userData.connectionStatus.trim().toLowerCase());
    }
  }, [userData?.connectionStatus]);

  const handleConnectionClick = () => {
    if (userData?._id) {
      router.push(`/connections?profileId=${userData._id}&type=Company&tab=company`);
    } else {
      router.push("/connections?tab=company");
    }
  };

  const handleMessage = (target) => {
    const currentUserId = Cookies.get("userId");
    const profileId = target?._id;

    if (connectionStatus !== "connected") {
      Swal.fire({
        icon: "info",
        title: t("connectionRequiredTitle"), // e.g. "Connection Required"
        text: t("connectionRequiredText"),   // e.g. "You need to add this user to your connections before sending a message."
        confirmButtonText: t("ok"),          // custom OK button text
      });
      return;
    }
    if (currentUserId && profileId) {
      generateChatRoom(
        { userId: currentUserId, profileId: profileId },
        {
          onSuccess: (res) => {
            if (res.success) {
              router.push(`/chat?roomId=${res.data?.roomId || ""}`);
            } else {
              toast.error("Failed to generate chat room");
            }
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to generate chat room");
          },
        }
      );
    } else {
      toast.error("Unable to start chat. User information not available.");
    }
  };
  const handleResentPassword = () => {
    setIsPasswordModalOpen(true);
  };

  const handleRemoveConnection = () => {
    if (!userData || !paramsUserId) return;

    setIsRemoving(true);

    removeConnection(
      {
        id: paramsUserId,
        role: "Company",
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            // Refresh the page to update the UI
            setConnectionStatus("not connected");
          } else {
            toast.error(res?.message || t("Failedtoremoveconnection"));
          }
        },
        onError: (error) => {
          toast.error(error?.message || t("Failedtoremoveconnection"));
        },
        onSettled: () => {
          setIsRemoving(false);
        },
      }
    );
  };

  const copyToClipboard = async (text) => {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const buildCompanyShareUrl = (id) => {
    if (typeof window === "undefined" || !id) return "";
    const origin = window.location.origin || "";
    return `${origin}/${locale}/company/single-company/${id}?fromNetworkInvites=true`;
  };

  const handleShare = async (id) => {
    const shareUrl = buildCompanyShareUrl(id);
    if (!shareUrl) {
      toast.error("Unable to generate share link");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: userData?.companyName || "Check out this company!",
          text: userData?.tagline || "Amazing company!",
          url: shareUrl,
        });
        toast.success("Company shared successfully");
        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copyToClipboard(shareUrl);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Share fallback failed:", error);
      toast.error("Share unsupported");
    }
  };
  const handleAcceptInvite = () => {
    if (!paramsUserId) return;
    acceptInvitation(
      { id: paramsUserId, role: "Company" },
      {
        onSuccess: (res) => {
          if (res.success) {
            setConnectionStatus("connected");
            // toast.success(t("requestAccepted"));
          } else {
            toast.error(res?.message || t("Failedtoacceptconnection"));
          }
        },
        onError: (error) => {
          toast.error(error?.message || t("Failedtoacceptconnection"));
        },
      }
    );
  };
  const handleContactClick = (item) => {
    if (isCreateConnectionLoading) return;

    // Optimistic UI: immediately reflect request sent
    const previousStatus = connectionStatus;
    setConnectionStatus("pending");
    setDidSendRequest(true);

    createConnection(
      { id: item._id, role: item.role },
      {
        onSuccess: (res) => {
          if (!res.success) {
            toast.error(res?.message || t("Failedtoconnect"));
            // rollback if API indicates failure
            setConnectionStatus(previousStatus || "not connected");
            setDidSendRequest(false);
          }
        },
        onError: (error) => {
          toast.error(error?.message || t("Failedtoconnect"));
          // rollback on error
          setConnectionStatus(previousStatus || "not connected");
          setDidSendRequest(false);
        },
      }
    );
  };
  const handleRejectInvite = () => {
    if (!paramsUserId) return;

    // ✅ Immediately update UI
    setConnectionStatus("not connected");

    rejectInvitation(
      { id: paramsUserId, role: "Company" },
      {
        onSuccess: (res) => {
          if (res.success) {
            // toast.success(t("requestRejected"));
          } else {
            toast.error(res?.message);
            // rollback if API fails
            setConnectionStatus(userData?.connectionStatus || "pending");
          }
        },
        onError: (error) => {
          toast.error(error?.message);
          // rollback if API fails
          setConnectionStatus(userData?.connectionStatus || "pending");
        },
      }
    );
  };

  if (isLoading) {
    return <UserBannerSkeleton />;
  }
  return (
    <div className="w-full overflow-hidden rounded-md xl:max-w-[829px]">
      <div
        className={`flex items-center justify-between rounded-[5px] ${userData.coverBannerUrl ? "" : "bg-[#CFE6CC]/[50%] px-4 py-6 sm:px-8 md:px-16 lg:px-24"} h-40 md:h-48 lg:h-56`}
      >
        {userData?.coverBannerUrl ? (
          <ImageFallback
            fallbackSrc={logo}
            width={1080}
            height={720}
            src={userData?.coverBannerUrl && getImg(userData.coverBannerUrl)}
            alt="Company Banner"
            className="h-auto w-full object-contain object-top"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center gap-2">
            <ImageFallback
              src={logo}
              width={150}
              height={50}
              loading="lazy"
              alt="Logo"
              className="h-auto w-[150px] sm:w-[180px] md:w-[200px]"
            />
          </div>
        )}
      </div>

      <div className="relative bg-white px-4 py-6 md:px-8 md:py-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex w-full flex-col gap-0.5 px-2 pt-5 sm:pt-0 mt-3 sm:mt-0">
            <h2 className="sm:text-lg text-xl font-bold text-black md:text-xl">
              <div className="flex items-center gap-2">
                {`${userData?.companyName || "Company Name"}`}
                <span className="px-1">
                  {userData?.isLGBTQFriendly && (
                    <Image
                      src={galleryIcon}
                      alt="LGBTQ friendly"
                      width={26}
                      height={26}
                      className="inline-block"
                    />
                  )}
                </span>
                <button
                  onClick={() => handleShare(userData?._id)}
                  disabled={isShareLoading}
                  className={`share-btn mt-1 px-2 text-xl ${isShareLoading ? "cursor-not-allowed opacity-50" : ""}`}
                  title="Share"
                >
                  <Share width={18} height={18} className="text-[#888DA8]" />
                </button>
              </div>
            </h2>
            <p className="text-[13px] font-normal md:text-[15px]">
              {userData?.tagline || "Company Tagline"}
            </p>
            <p className="text-xs font-normal text-[#888DA8]">{userData?.country || "Country"}</p>

            {/* {isCurrentUser ? (
              <div className="flex gap-2">
                <button className="profile-btn" onClick={() => setOpen(true)}>
                  {t("editProfile")}
                </button>
                <button className="profile-btn" onClick={() => handleResentPassword()}>
                  Reset Password
                </button>
              </div>
            ) : (
              <div className="mt-3.5 flex gap-2">
                {fromConnections ? (
                  <button
                    onClick={handleRemoveConnection}
                    disabled={isRemoving}
                    className="text-primary border-primary border px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRemoving ? t("removing") : t("remove")}
                  </button>
                ) : (
                  <button className="connect-btn">{t("connect")}</button>
                )}
                <button className="message-btn">{t("message")}</button>
                <button className="flag-btn group" onClick={() => setIsModalOpen(true)}>
                  <Flag className="stroke-grayBlueText group-hover:stroke-primary transition-all duration-200" />
                </button>
                <ReportModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
              </div>
            )} */}

            {isCurrentUser ? (
              <div className="flex gap-2">
                <button className="profile-btn" onClick={() => setOpen(true)}>
                  {t("editProfile")}
                </button>
                <button className="profile-btn" onClick={() => handleResentPassword()}>
                  {t("resetPassword")}
                </button>
              </div>
            ) : (
              <div className="mt-3.5 flex gap-2">
                {/* <p>DEBUG: {connectionStatus}</p>  */}
                {fromConnectionRequest ? (
                  <>
                    {connectionStatus === "pending" && didSendRequest && (
                      <button className="connect-btn cursor-not-allowed opacity-60" disabled>
                        {t("requestSent")}
                      </button>
                    )}
                    {connectionStatus === "pending" && !didSendRequest && (
                      <>
                        <button
                          className="connect-btn"
                          onClick={handleAcceptInvite}
                          disabled={isAccepting}
                        >
                          {isAccepting ? t("accepting") : t("accept")}
                        </button>
                        <button
                          onClick={handleRejectInvite}
                          disabled={isRejecting}
                          className="text-primary border-primary border px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRejecting ? t("rejecting") : t("reject")}
                        </button>
                      </>
                    )}
                    {connectionStatus === "not connected" && (
                      <button
                        className="connect-btn"
                        onClick={() => handleContactClick(userData)}
                      >
                        {t("Addconnection")}
                      </button>
                    )}
                  </>
                ) : (
                  connectionStatus === "not connected" && (
                    <button
                      className="connect-btn"
                      onClick={() => handleContactClick(userData)}
                    >
                      {t("Addconnection")}
                    </button>
                  )
                )}

                {(!fromConnectionRequest && connectionStatus === "pending") && (
                  <button className="connect-btn cursor-not-allowed opacity-60" disabled>
                    {t("requestSent")}
                  </button>
                )}

                {connectionStatus === "connected" && (
                  <button
                    onClick={handleRemoveConnection}
                    disabled={isRemoving}
                    className="text-primary border-primary border px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRemoving ? t("removing") : t("remove")}
                  </button>
                )}
                <button
                  className="message-btn"
                  onClick={() => handleMessage(userData)}
                  disabled={isGeneratingChat}
                >
                  {isGeneratingChat ? t("generating") : t("message")}
                </button>
                <button className="flag-btn group" onClick={() => setIsModalOpen(true)}>
                  <Flag className="stroke-grayBlueText group-hover:stroke-primary transition-all duration-200" />
                </button>
                <ReportModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userData={userData} />
              </div>
            )}
          </div>
          <div className="flex w-full flex-col items-end justify-center">
            <div className="absolute top-[34px] mr-0 h-32 w-32 border overflow-hidden rounded-full -mt-24 md:mr-4 profile-image">
              <ImageFallback
                src={userData?.logoUrl && getImg(userData.logoUrl)}
                loading="lazy"
                width={128}
                height={128}
                fallbackSrc={noImage2}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-2 flex w-full overflow-hidden border border-black/10 sm:mt-25 sm:max-w-xs md:mt-26 xl:max-w-[266px]">
              <div
                onClick={handleConnectionClick}
                className="w-1/2 cursor-pointer border-r border-black/10 px-2 py-4 text-center hover:bg-gray-50"
              >
                <p className="text-primary text-[16px] font-bold">
                  {userData?.connectionCount || 0}
                </p>
                <p className="text-xs font-normal text-black">{t("connections")}</p>
              </div>

              <div className="w-1/2 px-2 py-4 text-center">
                <p className="text-primary text-[16px] font-bold">{userData?.views || 0}</p>
                <p className="text-xs font-normal text-black">{t("views")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EdicCompanyProfileModal open={open} onClose={() => setOpen(false)} userData={userData} />
      <PasswordResetModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userData={userData}
      />
    </div>
  );
};

export default CompanyBannerProfile;
