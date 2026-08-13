const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD ? "https://api.lincyai.online/service" : "")
).replace(/\/$/, "");

export const apiUrl = (path: string) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
