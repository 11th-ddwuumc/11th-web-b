import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1126px] items-center justify-between px-5">
        <div className="flex items-center gap-10">
          <Link to="/" aria-label="UMCine 영화 목록">
            <img
              src="/icons/movie.svg"
              alt="UMCine"
              className="h-6 w-6"
            />
          </Link>

          <nav className="flex items-center gap-6 text-sm font-semibold text-gray-500">
            <Link
              to="/"
              activeProps={{ className: "text-gray-900" }}
              className="transition hover:text-gray-900"
            >
              영화
            </Link>

            <Link
              to="/search"
              activeProps={{ className: "text-gray-900" }}
              className="transition hover:text-gray-900"
            >
              검색
            </Link>

            <span className="cursor-not-allowed text-gray-400">
              내 정보
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/search"
            aria-label="검색"
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-5 w-5"
            />
          </Link>

          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}