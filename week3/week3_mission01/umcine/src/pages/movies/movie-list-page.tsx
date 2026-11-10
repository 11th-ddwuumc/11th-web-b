import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1. 로딩 상태
  if (moviesQuery.isPending) {
    return (
      <div className="loading-state">영화 목록을 불러오는 중이에요...</div>
    );
  }

  // 2. 오류 상태
  if (moviesQuery.isError) {
    return (
      <div className="error-state">
        {moviesQuery.error instanceof Error
          ? moviesQuery.error.message
          : "영화 목록을 불러오지 못했어요."}
      </div>
    );
  }

  // 3. 빈 결과 상태
  if (movies.length === 0) {
    return <div className="empty-state">조건에 맞는 영화가 없어요.</div>;
  }

  // 이미지처럼 1~5페이지(또는 현재 페이지 기준 주변 번호)를 동적으로 생성하는 로직
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 4. 성공 상태
  return (
    <main className="main-content">
      <div className="section-header">
        <h2 className="section-title">영화 목록</h2>
      </div>

      <MovieGrid movies={movies} />

      {/* 이미지와 같은 디자인 형태의 페이지네이션 컨트롤러 */}
      <div
        className="pagination-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "2rem",
        }}
      >
        {/* 이전 페이지 버튼 (<) */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || moviesQuery.isFetching}
          className="pagination-btn prev-btn"
        >
          &lt;
        </button>

        {/* 페이지 번호 버튼들 (1, 2, 3, 4, 5...) */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`pagination-number-btn ${page === num ? "active" : ""}`}
            style={{
              backgroundColor: page === num ? "#1e212b" : "transparent", // 선택된 번호 배경색 (디자인에 맞게 조절 가능)
              color: page === num ? "#fff" : "#333",
              borderRadius: "8px",
              padding: "0.5rem 0.8rem",
              border: "none",
              cursor: "pointer",
              fontWeight: page === num ? "bold" : "normal",
            }}
          >
            {num}
          </button>
        ))}

        {/* 다음 페이지 버튼 (>) */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages || moviesQuery.isFetching}
          className="pagination-btn next-btn"
        >
          &gt;
        </button>
      </div>
    </main>
  );
}
