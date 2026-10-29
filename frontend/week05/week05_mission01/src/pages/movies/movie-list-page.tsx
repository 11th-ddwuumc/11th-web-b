import { useEffect, useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchMovies() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) {
          setMovies(response.results);
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

    fetchMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="px-20 pt-6 pb-15">
      <h1 className="mb-5 text-[32px] leading-[44px] font-bold text-ink">영화 목록</h1>
      {isLoading ? (
        <p className="py-16 text-center text-[15px] font-medium text-muted">불러오는 중이에요...</p>
      ) : errorMessage ? (
        <p className="py-16 text-center text-[15px] font-medium text-muted">{errorMessage}</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </main>
  );
}

export default MovieListPage;
