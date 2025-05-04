// Utility to construct a full image URL from a relative path
export function getImageUrl(path?: string | null): string | null {
  if (!path) return null;
  // If already a full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = process.env.IMAGE_SERVER_URL?.replace(/\/$/, "") || "";
  // Ensure no double slashes
  return `${base}/${path.replace(/^\//, "")}`;
}
