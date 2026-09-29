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
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  const navigate = useNavigate({
    from: "/search",
  });

  const [searchText, setSearchText] = useState(
    query ?? "",
  );

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery =
    query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title
            .toLowerCase()
            .includes(normalizedQuery) ||
          movie.originalTitle
            .toLowerCase()
            .includes(normalizedQuery),
      )
    : [];

  function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery
        ? { query: nextQuery }
        : {},
    });
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-65px)] w-full max-w-[1126px] px-5 py-8">
      <h1 className="text-left text-2xl font-extrabold text-gray-900">
        영화 검색
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex h-11 w-full items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      >
        <label
          htmlFor="movie-search"
          className="sr-only"
        >
          검색어
        </label>

        <img
          src="/icons/search.svg"
          alt=""
          className="ml-4 h-4 w-4"
        />

        <input
          id="movie-search"
          aria-label="검색어"
          value={searchText}
          onChange={(event) =>
            setSearchText(event.target.value)
          }
          placeholder="영화 제목을 검색해 주세요."
          className="min-w-0 flex-1 px-3 text-sm outline-none placeholder:text-gray-400"
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
              className="h-4 w-4"
            />
          </button>
        )}

        <button
          type="submit"
          className="mr-1 rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold text-white"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <div className="flex min-h-[430px] items-center justify-center">
          <p className="text-2xl font-bold text-gray-800">
            어떤 영화를 찾고 있나요?
          </p>
        </div>
      ) : (
        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between border-b border-gray-200 pb-3">
            <h2 className="text-lg font-bold text-gray-900">
              ‘{query}’ 검색 결과
            </h2>

            <p className="text-xs text-gray-500">
              영화 {searchResults.length}편
            </p>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-24 text-center text-gray-500">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="py-5 first:pt-0"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{
                      movieId: String(movie.id),
                    }}
                    className="grid grid-cols-[80px_1fr_auto] gap-4 hover:bg-gray-50 sm:grid-cols-[96px_1fr_auto]"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="aspect-[2/3] w-20 rounded-md object-cover sm:w-24"
                    />

                    <div className="min-w-0 text-left">
                      <h3 className="text-base font-bold text-gray-900">
                        {movie.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {movie.originalTitle}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {movie.releaseDate}
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                        {movie.overview}
                      </p>
                    </div>

                    <span className="self-end whitespace-nowrap text-xs font-semibold text-blue-600">
                      상세 보기 →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}