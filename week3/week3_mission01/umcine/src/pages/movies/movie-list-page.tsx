import { useState } from "react";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import MovieGrid from "../../components/movies/movie-grid";

export const MovieListPage = () => {
  const [movieList, setMovieList] = useState<Movie[]>(movies);

  const handleToggleBookmark = (id: number) => {
    setMovieList((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }
          : movie
      )
    );
  };

  return (
    <main className="main-content">
      <div className="section-header">
        <h2 className="section-title">영화 목록</h2>
      </div>

      <MovieGrid
        movies={movieList}
        onToggleBookmark={handleToggleBookmark}
      />
    </main>
  );
};