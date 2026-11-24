"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

import { useAuthReady } from "./providers";

export function AuthGate({ children, guest = false }: { children: ReactNode; guest?: boolean }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);
  const ready = useAuthReady();
  const blocked = guest ? Boolean(token) : !token;
  useEffect(() => {
    if (ready && blocked) router.replace(guest ? "/" : "/login");
  }, [ready, blocked, guest, router]);
  if (!ready || blocked) return <main role="status" className="p-8">확인 중…</main>;
  return children;
}
