export const formatDate = (date) => {
  if (!date) return "";
  return date.split(" ")[0]; // "2026-04-30"
};
