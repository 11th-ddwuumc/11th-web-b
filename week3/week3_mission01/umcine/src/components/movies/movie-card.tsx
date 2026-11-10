import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div className="movie-card" style={{ position: "relative" }}>
      <Link
        to="/movies/$movieId"
        params={{
          movieId: String(movie.id),
        }}
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div className="poster-wrapper">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="poster-img"
            />
          ) : (
            <div className="poster-placeholder">포스터가 없습니다.</div>
          )}
        </div>

        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>

          <p className="movie-date">
            {movie.release_date || "개봉일 정보 없음"}
          </p>
        </div>
      </Link>

      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
        }}
      >
        <BookmarkButton movieId={movie.id} />
      </div>
    </div>
  );
}
