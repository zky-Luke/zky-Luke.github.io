const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD ? "https://service.lincyai.online" : "")
).replace(/\/$/, "");

export const apiUrl = (path: string) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
