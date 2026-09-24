import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isMovieActive = pathname === "/" || pathname.startsWith("/movies");
  const isSearchActive = pathname.startsWith("/search");

  return (
    <header className="flex h-[91px] items-center justify-between border-b border-line bg-surface px-20">
      <div className="flex items-center gap-[42px]">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand">
            <img src="/icons/movie.svg" alt="" className="h-6 w-6 brightness-0 invert" />
          </span>
          <span className="text-xl leading-6 font-bold text-ink">UMCine</span>
        </Link>
        <nav>
          <ul className="flex items-center gap-[30px]">
            <li>
              <Link
                to="/"
                className={cn(
                  "text-[15px] leading-[17px]",
                  isMovieActive
                    ? "font-semibold text-ink underline decoration-2 underline-offset-[6px]"
                    : "font-medium text-muted",
                )}
              >
                영화
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className={cn(
                  "text-[15px] leading-[17px]",
                  isSearchActive
                    ? "font-semibold text-ink underline decoration-2 underline-offset-[6px]"
                    : "font-medium text-muted",
                )}
              >
                검색
              </Link>
            </li>
            <li>
              <span className="text-[15px] leading-[17px] font-medium text-muted">내 정보</span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center gap-2.5">
        <Link
          to="/search"
          aria-label="영화 검색"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-md hover:bg-page"
        >
          <img src="/icons/search.svg" alt="" width={24} height={24} />
        </Link>
        <button
          type="button"
          className="flex h-[42px] w-[71px] items-center justify-center rounded-md bg-brand text-sm font-semibold text-surface hover:opacity-90"
        >
          로그인
        </button>
      </div>
    </header>
  );
}

export default Header;
