import type { TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import { getTmdbPosterUrl, getTmdbBackdropUrl } from "./tmdb-image";

export function convertTmdbMovie(movie: TmdbMovieListItem): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date
      ? movie.release_date.replaceAll("-", ".")
      : "개봉일 정보 없음",
    posterPath: getTmdbPosterUrl(movie.poster_path) ?? "",
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path) ?? "",
    genres: [],
    runtime: "",
    tagline: "",
    overview: movie.overview,
    isBookmarked: false,
  };
}