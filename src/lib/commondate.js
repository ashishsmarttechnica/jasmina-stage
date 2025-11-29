
// src/utils/formatRelativeTime.js
// utils/formatRelativeTime.js
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(localizedFormat);

export const formatRelativeTime = (dateInput) => {
  const now = dayjs();
  const postDate = dayjs(dateInput);
  const diffInMinutes = now.diff(postDate, "minute");
  const diffInHours = now.diff(postDate, "hour");
  const diffInDays = now.diff(postDate, "day");

  if (postDate.isToday()) {
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else {
      return `${diffInHours} hours ago`;
    }
  }

  if (postDate.isYesterday()) {
    return `Yesterday at ${postDate.format("h:mm A")}`;
  }

  if (diffInDays < 7) {
    return postDate.format("dddd [at] h:mm A"); // e.g. "Monday at 4:15 PM"
  }

  return postDate.format("DD MMM YYYY, h:mm A"); // e.g. "05 May 2025, 2:30 PM"
};



export const formatDateTime = (dateInput, options = {}) => {
  if (!dateInput) return "";

  try {
    const date = new Date(dateInput);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      ...options,
    });
  } catch (error) {
    console.error("Invalid date input:", dateInput);
    return "";
  }
};