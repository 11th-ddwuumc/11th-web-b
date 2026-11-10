import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import { getMovies } from "../../api/movies/get-movies";
import { convertTmdbMovie } from "../../utils/movies/convert-tmdb-movie";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      try {
        const response = await getMovies({ page: 1 });

        if (!ignore) {
          setMovies(response.results.map(convertTmdbMovie));
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="mx-auto min-h-[calc(100vh-65px)] w-full max-w-[1126px] px-5 py-8">
      <h1 className="mb-6 text-left text-2xl font-extrabold tracking-tight text-gray-900">
        영화 목록
      </h1>

      {isLoading ? (
        <p>영화 목록을 불러오는 중...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}

      <Pagination />
    </main>
  );
}