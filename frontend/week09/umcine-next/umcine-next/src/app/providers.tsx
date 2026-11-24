"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";

const AuthReadyContext = createContext(false);
export const useAuthReady = () => useContext(AuthReadyContext);

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }));
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    void Promise.resolve().then(() => useAuthStore.persist?.rehydrate())
      .catch(() => undefined).finally(() => setAuthReady(true));
    void useBookmarkStore.persist?.rehydrate();
  }, []);
  return <QueryClientProvider client={client}><AuthReadyContext.Provider value={authReady}>{children}</AuthReadyContext.Provider><ReactQueryDevtools initialIsOpen={false} /></QueryClientProvider>;
}
