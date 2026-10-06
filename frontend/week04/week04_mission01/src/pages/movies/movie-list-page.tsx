import { movies } from "../../data/movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {


  return (
    <main className="mx-auto min-h-[calc(100vh-65px)] w-full max-w-[1126px] px-5 py-8">
      <h1 className="mb-6 text-left text-2xl font-extrabold tracking-tight text-gray-900">
        영화 목록
      </h1>
      <MovieGrid movies={movies} />

      <Pagination />
    </main>
  );
}