const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export class ApiError extends Error {
  readonly code: string;
  constructor(code: string, message: string) { super(message); this.code = code; }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = (await response.json()) as ApiResponse<T> | T;
  if (!response.ok) {
    const error = body as ApiResponse<null>;
    throw new ApiError(error.code || `HTTP${response.status}`, error.message || "요청에 실패했습니다.");
  }
  return body as T;
}

export function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
