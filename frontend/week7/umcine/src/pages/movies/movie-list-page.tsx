import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { getMovies } from "../../api/tmdb";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function MovieListPage() {
  const [page, setPage] = useState(1);
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
  const movies = moviesQuery.data?.results ?? [];

  return (
    <div className="flex min-h-[calc(100vh-70px)] w-full flex-col bg-[#f7f8fa] min-[521px]:min-h-[calc(100vh-90px)]">
      <main className="mx-auto w-[1180px] max-w-[calc(100%_-_40px)] flex-1 pt-6 pb-[70px] min-[521px]:pt-[31px] min-[761px]:max-w-[calc(100%_-_80px)]">
        <h1 className="mt-0 mb-[22px] text-[25px] leading-tight font-extrabold tracking-[-1.2px] text-[#171719] min-[521px]:text-[30px]">
          영화 목록
        </h1>

        {moviesQuery.isPending ? (
          <p>영화를 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p className="text-red-600">{moviesQuery.error.message}</p>
        ) : movies.length === 0 ? (
          <p>표시할 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={page}
              totalPages={moviesQuery.data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>

      <footer className="flex min-h-[58px] w-full shrink-0 items-center border-t border-[#e5e7ea] bg-white">
        <div className="mx-auto flex w-[1180px] max-w-[calc(100%_-_40px)] items-center justify-center gap-1.5 text-center text-[10px] leading-[1.4] text-[#91959c] min-[521px]:justify-end min-[761px]:max-w-[calc(100%_-_80px)]">
          <img
            className="h-auto w-[23px]"
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB"
          />

          <span>
            This product uses the TMDB API but is not
            endorsed or certified by TMDB.
          </span>
        </div>
      </footer>
    </div>
  );
}
