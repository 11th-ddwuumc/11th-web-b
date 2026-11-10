import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const normalizedQuery = query?.trim() ?? "";

  // 검색 폼 input 제어용 local state
  const [searchText, setSearchText] = useState(query ?? "");

  // URL query 파라미터를 기반으로 useQuery 실행
  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    void navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="search-page">
      {/* 검색 입력 폼 영역 */}
      <section className="search-work">
        <h1>어떤 영화를 찾고 있나요?</h1>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            aria-label="검색어"
            placeholder="검색어를 입력하세요."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <button type="submit" aria-label="검색">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16.5 16.5L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>
      </section>

      {/* 검색 결과 영역 */}
      {normalizedQuery && (
        <section className="search-results">
          <div className="search-results-header">
            <h2>'{query}' 검색 결과</h2>

            {searchQuery.isSuccess && (
              <p>현재 표시된 영화 {searchResults.length}편</p>
            )}
          </div>

          {searchQuery.isLoading ? (
            <p className="search-loading" role="status">
              검색 중이에요...
            </p>
          ) : searchQuery.isError ? (
            <p className="search-error" role="alert">
              {searchQuery.error instanceof Error
                ? searchQuery.error.message
                : "검색 결과를 불러오지 못했어요."}
            </p>
          ) : searchResults.length === 0 ? (
            <p className="search-empty">영화를 찾을 수 없어요.</p>
          ) : (
            <div className="search-result-grid">
              {searchResults.map((movie) => {
                const posterUrl = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : null;

                return (
                  <Link
                    key={movie.id}
                    to="/movies/$movieId"
                    params={{
                      movieId: String(movie.id),
                    }}
                    className="search-result-card"
                  >
                    {posterUrl ? (
                      <img src={posterUrl} alt={`${movie.title} 포스터`} />
                    ) : (
                      <div className="poster-placeholder">
                        포스터가 없습니다.
                      </div>
                    )}

                    <div className="search-result-info">
                      <h3>{movie.title}</h3>

                      <p className="search-result-original">
                        {movie.original_title}
                      </p>

                      <p className="search-result-date">
                        {movie.release_date || "개봉일 정보 없음"}
                      </p>

                      <p className="search-result-overview">
                        {movie.overview || "등록된 줄거리가 없습니다."}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
