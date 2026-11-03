
import { useQuery } from "@tanstack/react-query";
import type { Movie } from "../../types/movie";
import { getMovies } from "../../api/movies/get-movies";
import { convertTmdbMovie } from "../../utils/movies/convert-tmdb-movie";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page: 1 }],
    queryFn: () => getMovies({ page: 1 }),
  });

  const movies: Movie[] =
    moviesQuery.data?.results.map(convertTmdbMovie) ?? [];

  return (
    <main className="mx-auto min-h-[calc(100vh-65px)] w-full max-w-[1126px] px-5 py-8">
      <h1 className="mb-6 text-left text-2xl font-extrabold tracking-tight text-gray-900">
        영화 목록
      </h1>

      {moviesQuery.isPending ? (
        <p>영화 목록을 불러오는 중...</p>
      ) : moviesQuery.isError ? (
        <p>영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}

      <Pagination />
    </main>
  );
}
