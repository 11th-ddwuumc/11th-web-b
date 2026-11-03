
import {
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import {
  useEffect,
  useState,
  type SubmitEvent,
} from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { Movie } from "../../types/movie";
import { convertTmdbMovie } from "../../utils/movies/convert-tmdb-movie";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  const navigate = useNavigate({
    from: "/search",
  });

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const [searchText, setSearchText] = useState(query ?? "");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  useEffect(() => {
    const normalizedQuery = query?.trim() ?? "";

    if (!normalizedQuery) {
      setSearchResults([]);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    let ignore = false;

    async function loadSearchResults() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await searchMovies({
          query: normalizedQuery,
          page: 1,
        });

        if (!ignore) {
          setSearchResults(response.results.map(convertTmdbMovie));
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 검색에 실패했어요. 잠시 후 다시 시도해 주세요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSearchResults();

    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  const normalizedQuery = query?.trim() ?? "";

  return (
    <main className="min-h-[calc(100vh-65px)] bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[1126px] px-5 py-8">
        <h1 className="text-left text-[24px] font-extrabold tracking-[-0.03em] text-[#17191c]">
          영화 검색
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-5 flex h-[44px] w-full items-center overflow-hidden rounded-[5px] border border-[#dfe2e6] bg-white"
        >
          <label htmlFor="movie-search" className="sr-only">
            검색어
          </label>

          <img
            src="/icons/search.svg"
            alt=""
            className="ml-3.5 h-4 w-4 opacity-70"
          />

          <input
            id="movie-search"
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="영화 제목을 검색해 주세요."
            className="min-w-0 flex-1 px-3 text-[13px] text-[#222] outline-none placeholder:text-[#a7abb0]"
          />

          {searchText && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => setSearchText("")}
              className="mr-1 flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
            >
              <img
                src="/icons/close.svg"
                alt=""
                className="h-3.5 w-3.5 opacity-70"
              />
            </button>
          )}

          <button
            type="submit"
            className="mr-1.5 h-[34px] rounded-[4px] bg-[#202328] px-4 text-[12px] font-semibold text-white transition hover:bg-[#111318]"
          >
            검색
          </button>
        </form>

        {!normalizedQuery ? (
          <div className="flex min-h-[440px] items-center justify-center">
            <p className="text-[24px] font-extrabold tracking-[-0.04em] text-[#17191c]">
              어떤 영화를 찾고 있나요?
            </p>
          </div>
        ) : (
          <section className="mt-7">
            <div className="mb-0 flex h-[42px] items-center justify-between border-b border-[#dfe2e6]">
              <h2 className="text-[13px] font-bold text-[#17191c]">
                ‘{query}’ 검색 결과
              </h2>

              <p className="text-[10px] text-[#9da2a8]">
                영화 {isLoading ? "..." : searchResults.length}편 · 1페이지
              </p>
            </div>

            {isLoading ? (
              <div className="py-24 text-center text-sm text-[#8d9298]">
                검색 중...
              </div>
            ) : errorMessage ? (
              <div className="py-24 text-center text-sm text-red-500">
                {errorMessage}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-24 text-center text-sm text-[#8d9298]">
                검색 결과가 없어요.
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                {searchResults.map((movie) => {
                  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

                  return (
                    <li
                      key={movie.id}
                      className="border-b border-[#e2e4e7] py-3.5"
                    >
                      <div className="grid grid-cols-[70px_1fr_auto] gap-3">
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="contents"
                        >
                          {movie.posterPath ? (
                            <img
                              src={movie.posterPath}
                              alt={`${movie.title} 포스터`}
                              className="h-[102px] w-[70px] rounded-[5px] object-cover"
                            />
                          ) : (
                            <div className="flex h-[102px] w-[70px] items-center justify-center rounded-[5px] bg-gray-200 text-center text-[10px] text-gray-500">
                              포스터 없음
                            </div>
                          )}

                          <div className="min-w-0 pt-0.5 text-left">
                            <h3 className="truncate text-[12px] font-bold text-[#25282c]">
                              {movie.title}
                            </h3>

                            <p className="mt-1 truncate text-[9px] text-[#999ea4]">
                              {movie.originalTitle}
                            </p>

                            <p className="mt-0.5 text-[9px] text-[#999ea4]">
                              {movie.releaseDate}
                            </p>

                            <p className="mt-2 line-clamp-2 text-[9px] leading-[1.55] text-[#777d84]">
                              {movie.overview || "줄거리 정보가 없어요."}
                            </p>
                          </div>
                        </Link>

                        <div className="flex flex-col items-end justify-between">
                          <button
                            type="button"
                            onClick={() => toggleBookmark(movie.id)}
                            aria-label={isBookmarked ? "북마크 해제" : "북마크"}
                            className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                              isBookmarked
                                ? "border-blue-600 bg-blue-600"
                                : "border-[#dfe2e6] bg-white"
                            }`}
                          >
                            <img
                              src={
                                isBookmarked
                                  ? "/icons/bookmark.svg"
                                  : "/icons/bookmark-outline.svg"
                              }
                              alt=""
                              className={`h-4 w-4 ${
                                isBookmarked ? "brightness-0 invert" : ""
                              }`}
                            />
                          </button>

                          <Link
                            to="/movies/$movieId"
                            params={{ movieId: String(movie.id) }}
                            className="whitespace-nowrap pb-0.5 text-[9px] font-semibold text-[#2563eb]"
                          >
                            상세 보기 →
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
