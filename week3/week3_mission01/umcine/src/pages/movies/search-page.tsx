import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react"; // 1. useEffect 제거
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  // 2. query와 마지막으로 수신한 query를 동기화하기 위한 state
  const [prevQuery, setPrevQuery] = useState(query);
  const [searchText, setSearchText] = useState(query ?? "");

  // 3. 렌더링 도중 URL query 변경 감지 시 즉시 상태 조정 (useEffect 없음)
  if (prevQuery !== query) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  // 검색 기능 (기존 코드 그대로 유지)
  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="search-page">
      {/* 검색 영역 */}
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

      {/* 검색 결과 */}
      {normalizedQuery && (
        <section className="search-results">
          <div className="search-results-header">
            <h2>‘{query}’ 검색 결과</h2>
            <p>영화 {searchResults.length}편</p>
          </div>

          {searchResults.length === 0 ? (
            <p className="search-empty">영화를 찾을 수 없어요.</p>
          ) : (
            <div className="search-result-grid">
              {searchResults.map((movie) => (
                <Link
                  key={movie.id}
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="search-result-card"
                >
                  <img src={movie.posterPath} alt={`${movie.title} 포스터`} />

                  <div className="search-result-info">
                    <h3>{movie.title}</h3>

                    <p className="search-result-original">
                      {movie.originalTitle}
                    </p>

                    <p className="search-result-date">{movie.releaseDate}</p>

                    <p className="search-result-overview">{movie.overview}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
