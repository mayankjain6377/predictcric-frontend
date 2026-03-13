export const formatMatchTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const timeUntilMatch = (dateStr) => {
  const now = new Date();
  const match = new Date(dateStr);
  const diff = match - now;

  if (diff < 0) return "Started";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  }
  return `${hours}h ${minutes}m left`;
};