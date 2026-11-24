import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "../components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "영화를 검색하고 관심 있는 작품을 북마크하세요.",
  icons: "/favicon.svg",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
