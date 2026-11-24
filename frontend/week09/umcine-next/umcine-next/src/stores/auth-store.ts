
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      skipHydration: true,
      storage: createJSONStorage(() => typeof window === "undefined" ? {
        getItem: () => null, setItem: () => {}, removeItem: () => {},
      } : window.localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    },
  ),
);
