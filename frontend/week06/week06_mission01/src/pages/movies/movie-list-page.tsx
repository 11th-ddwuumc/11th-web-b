import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import { cn } from "../../utils/cn";

const PAGE_WINDOW_SIZE = 5;

function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const windowStart = Math.floor((page - 1) / PAGE_WINDOW_SIZE) * PAGE_WINDOW_SIZE + 1;
  const windowEnd = Math.min(windowStart + PAGE_WINDOW_SIZE - 1, totalPages);
  const pageNumbers = Array.from(
    { length: Math.max(windowEnd - windowStart + 1, 0) },
    (_, index) => windowStart + index,
  );
  const hasPreviousWindow = windowStart > 1;
  const hasNextWindow = windowEnd < totalPages;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handlePreviousWindow = () => {
    if (hasPreviousWindow) {
      setPage(windowStart - 1);
    }
  };

  const handleNextWindow = () => {
    if (hasNextWindow) {
      setPage(windowEnd + 1);
    }
  };

  return (
    <main className="px-20 pt-6 pb-15">
      <h1 className="mb-5 text-[32px] leading-[44px] font-bold text-ink">영화 목록</h1>
      {moviesQuery.isPending ? (
        <p className="py-16 text-center text-[15px] font-medium text-muted">
          영화를 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p className="py-16 text-center text-[15px] font-medium text-muted">
          {moviesQuery.error.message}
        </p>
      ) : movies.length === 0 ? (
        <p className="py-16 text-center text-[15px] font-medium text-muted">
          표시할 영화가 없어요.
        </p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handlePreviousWindow}
                disabled={!hasPreviousWindow}
                aria-label="이전 페이지 목록"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface disabled:opacity-40"
              >
                <img src="/icons/chevron-left.svg" alt="" width={16} height={16} />
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => handlePageChange(pageNumber)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold",
                    pageNumber === page
                      ? "bg-ink text-surface"
                      : "border border-line bg-surface text-ink",
                  )}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={handleNextWindow}
                disabled={!hasNextWindow}
                aria-label="다음 페이지 목록"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface disabled:opacity-40"
              >
                <img src="/icons/chevron-right.svg" alt="" width={16} height={16} />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default MovieListPage;
