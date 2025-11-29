"use client";
import { useRouter } from "@/i18n/navigation";
import useNotificationStore from "@/store/notification.store";
import { getTimeAgo } from "@/utils/dateUtils";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import ImageFallback from "../../common/shared/ImageFallback";
import getImg from "../../lib/getImg";
import useAuthStore from "../../store/auth.store";
import { getChatSocket } from "../../utils/socket";

const Notification = () => {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    hasMore,
    totalPages,
  } = useNotificationStore();

  const router = useRouter();
  const t = useTranslations("Jobs");
  const viewerId = Cookies.get("userId");
  const loaderRef = useRef(null);
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);

  // socket से आने वाले नए notifications
  const [notificationsData, setnotificationsData] = useState([]);

  const notificationList = Array.isArray(notifications?.results)
    ? notifications.results
    : Array.isArray(notifications)
      ? notifications
      : [];
  console.log(notificationList, "notificationsDatanotificationsData");

  // API से पहला fetch
  useEffect(() => {
    fetchNotifications(viewerId, page, 15, false);
  }, []);

  // socket setup
  useEffect(() => {
    if (!user?._id) return;

    const chatSocket = getChatSocket(user._id);
    console.log("[UserNavItems] Setting up socket for user:", user._id);

    if (chatSocket) {
      if (!chatSocket.connected) {
        console.log("[UserNavItems] Connecting socket...");
        chatSocket.connect();
      }

      chatSocket.emit("register", user._id);

      chatSocket.on("connect", () => {
        console.log("[UserNavItems] ✅ Socket connected");
      });

      chatSocket.on("new_notification", (data) => {
        console.log("[UserNavItems] 🔔 new notification received:", data);

        if (data) {
          // पुराने state में नया notification add करो (सबसे ऊपर)
          setnotificationsData((prev) => [data, ...prev]);
        }
      });

      chatSocket.on("disconnect", () => {
        console.log("[UserNavItems] ❌ Socket disconnected");
      });

      chatSocket.on("error", (error) => {
        console.error("[UserNavItems] Socket error:", error);
      });

      return () => {
        console.log("[UserNavItems] Cleaning up socket listeners");
        if (chatSocket) {
          chatSocket.off("connect");
          chatSocket.off("new_notification");
          chatSocket.off("disconnect");
          chatSocket.off("error");
        }
      };
    }
  }, [user?._id]);

  // infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    if (page >= totalPages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          const nextPage = page + 1;
          fetchNotifications(viewerId, nextPage, 15, true);
          setPage(nextPage);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading, page, viewerId]);

  // final notifications = socket वाले + API वाले
  const finalNotifications = [...notificationsData, ...notificationList];
  console.log(finalNotifications, "finalNotificationsfinalNotifications");

  const renderDescription = (desc) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return desc.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-words text-blue-600 underline"
        >
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };



  const handleNavigation = (n) => {
    console.log(n, "nnnnnnnnnnnnnnnn");
    console.log(n);

    // If message mentions an opportunity, send user to jobs
    const titleText = (n?.title || "").toLowerCase();
    const descText = (n?.description || "").toLowerCase();
    if (titleText.includes("opportunity") || descText.includes("opportunity")) {
      return `/jobs`;
    }

    // If someone applied for your job, go to company applications detail page
    // NOTE: The applications route expects a jobId in the :subid param, not the applicationId
    if (titleText.includes("applied for your job") || descText.includes("applied for your job")) {
      // Prefer explicit job identifiers over destinationId (which might be applicationId)
      const jobId =
        n?.jobId ||
        n?.job?._id ||
        n?.job?.id ||
        n?.meta?.jobId ||
        n?.payload?.jobId ||
        n?.targetJobId ||
        n?.destinationJobId ||
        null;

      if (jobId) {
        return `/company/single-company/${viewerId}/applications/${jobId}`;
      }

      // Last resort: if only destinationId exists, use it, but this may be applicationId
      if (n?.destinationId) {
        return `/company/single-company/${viewerId}/applications/${n.destinationId}`;
      }

      // Fallback: navigate to applications list
      return `/company/single-company/${viewerId}/applications`;
    }

    switch (n.type) {
      case "user_posted":
      case "like":
      case "profile_view": {
        if (n.userType === "User") {
          return `/single-user/${n?.userId?._id}`;
        } else if (n.userType === "Company") {
          return `/company/single-company/${n?.userId?._id}`;
        }
        break;
      }

      case "create_comment":
        return `/single-user/${viewerId}`;

      case "apply_job": {
        const jobId =
          n?.jobId ||
          n?.job?._id ||
          n?.job?.id ||
          n?.meta?.jobId ||
          n?.payload?.jobId ||
          n?.targetJobId ||
          n?.destinationJobId ||
          n?.destinationId ||
          null;

        if (jobId) {
          return `/company/single-company/${viewerId}/applications`;
        }
        return `/company/single-company/${viewerId}/applications`;
      }


      case "job_posted":
        return `/company/single-company/${n?.userId?._id}`;

      // case "connection_request":
      case "connection_request":
        {
          if (n.userType === "User") {
            return `/single-user/${n?.userId?._id}?fromConnectionRequest=true`;
          } else if (n.userType === "Company") {
            return `/company/single-company/${n?.userId?._id}?fromConnectionRequest=true`;
          }
          break;
        }
      // return `/feed`;
      case "connection_accepted":
        if (n.targetType === "User") {
          return `/connections?tab=people`;
        } else if (n.targetType === "Company") {
          return `/connections?profileId=${viewerId}&type=Company&tab=company`;
        }

      case "message":
        return `/chat`;

      case "plan_expired":
        return `/company/single-company/${viewerId}/previousplans`;

      case "post_reject":
        return `/company/single-company/${viewerId}/subscription`;

      case "interview_schedule":
      case "interview_schedual":
      case "interview_update":
      case "interview_cancel":
        if (n.targetType === "User") {
          return `/jobs/applied-jobs`;
        } else if (n.targetType === "Company") {
          return `/company/single-company/${viewerId}/interview`;
        }

      default:
        return "/";
    }
  };

  return (
    <div className="items-center justify-center rounded-lg">
      <div className="flex flex-col">
        {/* Loading skeleton (first load) */}
        {loading && finalNotifications.length === 0 && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="relative flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
              >
                <div className="h-[30px] w-[30px] rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse"></div>
                  <div className="h-3 w-2/3 rounded bg-gray-200 animate-pulse"></div>
                </div>
                <div className="absolute right-3 top-3 h-3 w-10 rounded bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        )}

        {error && finalNotifications.length === 0 && (
          <div className="py-4 text-center text-red-500">{error}</div>
        )}
        {!loading && !error && finalNotifications.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            No notifications found.
          </div>
        )}

        {finalNotifications.map((n, i) => (
          console.log(n?.profileImage, "notificationnnnnnnnnnnnnnnnnnnnnnnnnn"),
          // console.log(n?. , "helloooo+|+++++"),

          <div
            key={n._id || i}
            onClick={() => {
              const link = handleNavigation(n);
              if (link) router.push(link);

            }}
            className="relative mb-3 cursor-pointer rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-blue-400 hover:shadow-md"
          >
            <div className="flex gap-2">
              {/* {n?.userId && ( */}
              <div>
                <ImageFallback
                  src={getImg(n?.profileImage) && n?.profileImage && getImg(n?.profileImage)}
                  alt={n?.userId?.companyName || n?.userId?.profile?.userName}
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] rounded-full cursor-pointer hover:opacity-80 transition-opacity mt-3"
                  priority={true}
                />
              </div>
              {/* )} */}
              <div className="flex flex-col mt-2">
                <h3 className="font-semibold text-gray-900 text-base">{n.title}</h3>
                <p className="mt-1 whitespace-pre-line break-words text-gray-600 text-sm">
                  {renderDescription(n.description)}
                </p>
              </div>
              <span className="absolute right-3 top-2 text-xs text-gray-400">
                {getTimeAgo(n.createdAt)}
              </span>
            </div>
          </div>
        ))}

        {/* Skeleton while appending new notifications */}
        {loading && finalNotifications.length > 0 && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="relative flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
              >
                <div className="h-[30px] w-[30px] rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse"></div>
                  <div className="h-3 w-2/3 rounded bg-gray-200 animate-pulse"></div>
                </div>
                <div className="absolute right-3 top-3 h-3 w-10 rounded bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div ref={loaderRef} className="h-1" />

      {!hasMore && finalNotifications.length > 0 && (
        <div className="mt-2 text-center text-gray-500">
          <p>No more notifications to load.</p>
        </div>
      )}
    </div>
  );
};

export default Notification;
