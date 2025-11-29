export function getRelativeTime(date) {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now - target;

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return "just now";
}

/**
 * Get short relative time format
 * @param {string|Date} dateTime - The date to format
 * @returns {string} Formatted time string like "1 min ago", "59 min ago", "today", etc.
 */
export function getTimeAgo(dateTime) {
  const now = new Date();
  const target = new Date(dateTime);
  const diffMs = now - target;

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Check if it's the same day
  const isToday = now.toDateString() === target.toDateString();
  const isYesterday =
    new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === target.toDateString();

  // Less than 1 minute
  if (diffSeconds < 60) {
    return "now";
  }

  // 1-59 minutes
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  // 1-23 hours
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  // Same day (today) - show only time
  if (isToday) {
    const time = target.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return time;
  }

  // Yesterday - show "Yesterday" with time
  if (isYesterday) {
    const time = target.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `Yesterday ${time}`;
  }

  // 2-6 days ago - show date and time
  if (diffDays < 7) {
    const date = target.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const time = target.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${date} ${time}`;
  }

  // More than a week - show date and time
  const date = target.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: target.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
  const time = target.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} ${time}`;
}

/**
 * Calculate the duration between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date (can be "Present" for current date)
 * @returns {string} Formatted duration string
 */
export const calculateDateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = endDate === "Present" ? new Date() : new Date(endDate);

  // More accurate date difference calculation
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  // Adjust for day of month
  if (end.getDate() < start.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  const yearText = years === 1 ? "year" : "years";
  const monthText = months === 1 ? "month" : "months";

  let durationText = "";
  if (years > 0 && months > 0) {
    durationText = `(${years} ${yearText} ${months} ${monthText})`;
  } else if (years > 0) {
    durationText = `(${years} ${yearText})`;
  } else if (months > 0) {
    durationText = `(${months} ${monthText})`;
  } else {
    durationText = "(Less than 1 month)";
  }

  return durationText;
};

/**
 * Format date range with duration
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date (can be "Present" for current date)
 * @returns {string} Formatted date range with duration
 */
export const formatDateRangeWithDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = endDate === "Present" ? new Date() : new Date(endDate);
  const duration = calculateDateDuration(startDate, endDate);

  return `${start.toLocaleDateString()} - ${endDate === "Present" ? "Present" : end.toLocaleDateString()} ${duration}`;
};
