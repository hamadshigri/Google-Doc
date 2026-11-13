const configuredBaseUrl = import.meta.env.VITE_BASE_URL?.trim();

export const BASE_URL = (
  configuredBaseUrl
).replace(/\/$/, "");
