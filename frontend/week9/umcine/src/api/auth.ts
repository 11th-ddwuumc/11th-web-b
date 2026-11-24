import { apiRequest, type ApiResponse } from "./api-client";

export interface LoginResponse { nickname: string; accessToken: string; }

export const login = (email: string, password: string) =>
  apiRequest<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST", body: JSON.stringify({ email, password }),
  });
