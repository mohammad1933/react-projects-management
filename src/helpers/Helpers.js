import { formatDistanceToNow, format } from "date-fns";
import dayjs from "dayjs";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    // Today → "2 hours ago"
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (diffInHours < 48) {
    // Yesterday → "Yesterday at 2 PM"
    return `Yesterday at ${format(date, "h a")}`;
  }

  // Older → "2 days ago"
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getRemainingTime = (dueDate) => {
  const now = dayjs();
  const due = dayjs(dueDate);

  if (due.isBefore(now)) {
    return "Expired";
  }

  const minutes = due.diff(now, "minute");
  const hours = due.diff(now, "hour");
  const days = due.diff(now, "day");

  if (minutes < 60) {
    return `Remaining ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  if (hours < 24) {
    return `Remaining ${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  return `Remaining ${days} day${days !== 1 ? "s" : ""}`;
};