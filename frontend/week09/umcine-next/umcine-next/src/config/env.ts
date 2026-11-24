const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
export const env = {
  apiBaseUrl: backendUrl ? `${backendUrl.replace(/\/+$/, "")}/` : undefined,
};
