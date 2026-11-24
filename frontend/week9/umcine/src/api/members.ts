import { apiRequest, authHeaders, type ApiResponse } from "./api-client";

export const checkEmailDuplicate = (email: string) =>
  apiRequest<{ available: boolean }>(`/members/email/${encodeURIComponent(email)}`);

export const checkNicknameDuplicate = (nickname: string) =>
  apiRequest<{ available: boolean }>(`/members/nickname/${encodeURIComponent(nickname)}`);

export const signUp = (body: { email: string; nickname: string; password: string }) =>
  apiRequest<ApiResponse<number>>("/members", { method: "POST", body: JSON.stringify(body) });

export interface MemberInfo { email: string; nickname: string; createdAt: string; }

export const getMyInfo = () =>
  apiRequest<ApiResponse<MemberInfo>>("/members/me", { headers: authHeaders() });

export const updateMyInfo = (nickname: string) =>
  apiRequest<ApiResponse<MemberInfo>>("/members/me", {
    method: "PATCH", headers: authHeaders(), body: JSON.stringify({ nickname }),
  });
