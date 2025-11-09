export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Build a full API URL.
 * If API_BASE is empty, this will return a path relative to the current origin
 * (useful when you deploy Next and FastAPI to the same host and use relative
 * /api routes).
 */
export function apiUrl(path: string) {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return API_BASE ? `${API_BASE.replace(/\/$/, "")}${path}` : path;
}

export default apiUrl;
