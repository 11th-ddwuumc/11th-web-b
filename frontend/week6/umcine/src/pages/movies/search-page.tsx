import { BookmarkButton } from "../../components/bookmark-button";

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

import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../api/tmdb";

export function SearchPage() {
  const { query } = useSearch({
    from: "/search",
  });

  const navigate = useNavigate({
    from: "/search",
  });

  const [searchText, setSearchText] =
    useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim() ?? "";
  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });
  const searchResults = searchQuery.data?.results ?? [];

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
    <main className="mx-auto min-h-[calc(100vh-90px)] w-[1180px] max-w-[calc(100%_-_40px)] bg-[#f7f8fa] pt-6 pb-[70px] min-[521px]:pt-[31px] min-[761px]:max-w-[calc(100%_-_80px)]">
      <h1 className="mt-0 mb-[22px] text-[25px] leading-tight font-extrabold tracking-[-1.2px] text-[#171719] min-[521px]:text-[30px]">
        영화 검색
      </h1>

      <form
        className="mb-8 flex max-w-[640px] gap-2"
        onSubmit={handleSubmit}
      >
        <input
          className="h-11 flex-1 rounded-lg border border-[#dfe2e6] bg-white px-4 outline-none focus:border-[#2864e8]"
          aria-label="검색어"
          placeholder="영화 제목을 입력하세요"
          value={searchText}
          onChange={(event) =>
            setSearchText(event.target.value)
          }
        />

        <button
          className="cursor-pointer rounded-lg bg-[#2864e8] px-5 font-bold text-white"
          type="submit"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p>검색어를 입력해 주세요.</p>
      ) : searchQuery.isLoading ? (
        <p>검색 결과를 불러오는 중이에요.</p>
      ) : searchQuery.isError ? (
        <p className="text-red-600">{searchQuery.error.message}</p>
      ) : searchResults.length === 0 ? (
        <p>검색 결과가 없어요.</p>
      ) : (
        <>
          <p className="mb-5 text-sm text-[#6b7078]">
            “{query}” 검색 결과{" "}
            {searchResults.length}개
          </p>

          <section className="grid gap-4">
            {searchResults.map((movie) => (
              <article
                className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
                key={movie.id}
              >
                <Link
                  className="shrink-0"
                  to="/movies/$movieId"
                  params={{
                    movieId: String(movie.id),
                  }}
                >
                  <img
                    className="h-[180px] w-[120px] rounded-lg object-cover"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />
                </Link>

                <div>
                  <h2 className="mb-1 text-lg font-bold">
                    <Link
                      to="/movies/$movieId"
                      params={{
                        movieId: String(movie.id),
                      }}
                    >
                      {movie.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-[#6b7078]">
                    {movie.originalTitle}
                  </p>

                  <p className="mt-2 text-sm text-[#9a9da3]">
                    {movie.releaseDate}
                  </p>

                  <p className="mt-4 leading-relaxed text-[#45474c]">
                    {movie.overview}
                  </p>

                  <BookmarkButton
                    className="mt-4"
                    movieId={movie.id}
                    movieTitle={movie.title}
                  />
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
