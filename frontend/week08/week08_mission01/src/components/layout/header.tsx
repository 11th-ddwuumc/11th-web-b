
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1126px] items-center justify-between gap-3 px-5">
        <div className="flex items-center gap-4 sm:gap-10">
          <Link to="/" aria-label="UMCine 영화 목록">
            <img src="/icons/movie.svg" alt="UMCine" className="h-6 w-6" />
          </Link>

          <nav className="flex items-center gap-3 text-sm font-semibold text-gray-500 sm:gap-6">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-gray-900" }} className="whitespace-nowrap transition hover:text-gray-900">
              영화
            </Link>

            <Link to="/search" activeProps={{ className: "text-gray-900" }} className="whitespace-nowrap transition hover:text-gray-900">
              검색
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/search"
            aria-label="검색"
            className="hidden h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 sm:flex"
          >
            <img src="/icons/search.svg" alt="" className="h-5 w-5" />
          </Link>

          {!accessToken ? (
            <Link
              to="/login"
              className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link
              to="/mypage"
              className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
