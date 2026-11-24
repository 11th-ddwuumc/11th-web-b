"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinkClass =
  "relative flex h-full items-center whitespace-nowrap text-[13px] font-medium text-[#6b7078]";

const activeNavClass =
  "font-bold text-[#18191b] after:absolute after:right-0 after:bottom-[25px] after:left-0 after:h-0.5 after:bg-[#18191b]";

export function Header() {
  return (
    <header className="h-[70px] w-full shrink-0 border-b border-[#eceef1] bg-white min-[521px]:h-[90px]">
      <div className="mx-auto flex h-full w-[1180px] max-w-[calc(100%_-_40px)] items-center justify-between min-[761px]:max-w-[calc(100%_-_80px)]">
        <div className="flex h-full items-center">
          <Link
            className="mr-0 flex items-center gap-2 min-[521px]:mr-[45px]"
            href="/"
          >
            <span className="flex h-[29px] w-[29px] items-center justify-center rounded-[7px] border-2 border-[#191919]">
              <img
                className="h-[18px] w-[18px]"
                src="/icons/movie.svg"
                alt=""
              />
            </span>

            <span className="text-xl font-extrabold tracking-[-0.7px] text-[#191919]">
              UMCine
            </span>
          </Link>

          <Suspense fallback={null}>
            <Navigation />
          </Suspense>
        </div>

        <div className="flex items-center gap-3.5">
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dfe2e6] bg-white"
            href="/search"
            aria-label="검색"
          >
            <img
              className="h-[18px] w-[18px]"
              src="/icons/search.svg"
              alt=""
            />
          </Link>

          <Link
            className="h-10 cursor-pointer rounded-[7px] bg-[#2864e8] px-[18px] text-[13px] font-bold text-white"
            href="/login"
          >
            <span className="flex h-full items-center">로그인</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="hidden h-full items-center gap-[34px] min-[761px]:flex">
      <Link
        className={pathname === "/" ? `${navLinkClass} ${activeNavClass}` : navLinkClass}
        aria-current={pathname === "/" ? "page" : undefined}
        href="/"
      >
        영화
      </Link>
    
      <Link
        className={pathname === "/search" ? `${navLinkClass} ${activeNavClass}` : navLinkClass}
        aria-current={pathname === "/search" ? "page" : undefined}
        href="/search"
      >
        검색
      </Link>
    
      <Link className={pathname === "/my" ? `${navLinkClass} ${activeNavClass}` : navLinkClass}
        aria-current={pathname === "/my" ? "page" : undefined}
        href="/my">
        내 정보
      </Link>
    </nav>
  );
}
