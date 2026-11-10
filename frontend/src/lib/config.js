const configuredBaseUrl = import.meta.env.VITE_BASE_URL?.trim();

export const BASE_URL = (
  configuredBaseUrl || "http://localhost:3000"
).replace(/\/$/, "");
