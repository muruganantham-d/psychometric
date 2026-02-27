export function toPercent(value) {
  return `${Math.round(value)}%`;
}

export function formatDateFileStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
