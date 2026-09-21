import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="poster-wrapper">
        <img src={movie.posterPath} alt={movie.title} className="poster-img" />
        <button
          className={`bookmark-btn ${movie.isBookmarked ? "active" : ""}`}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label="북마크"
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt="Bookmark"
          />
        </button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-date">{movie.releaseDate}</p>
      </div>
    </div>
  );
}