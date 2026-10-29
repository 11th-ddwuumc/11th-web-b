import MovieGrid from "../../components/movies/movie-grid";
import { movies } from "../../data/movies";

function MovieListPage() {
  return (
    <main className="px-20 pt-6 pb-15">
      <h1 className="mb-5 text-[32px] leading-[44px] font-bold text-ink">영화 목록</h1>
      <MovieGrid movies={movies} />
    </main>
  );
}

export default MovieListPage;
