import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = { title: "UMCine", description: "영화 검색 및 평점 서비스", icons: "/favicon.svg" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body><Providers><Header />{children}
<footer className="border-t border-gray-200 bg-white px-5 py-6 text-center text-xs text-gray-500">
        <p>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block underline"
        >
          TMDB
        </a>
      </footer>
  </Providers></body></html>;
}
