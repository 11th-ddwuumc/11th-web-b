import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="poster-wrapper">
        <img src={movie.posterPath} alt={movie.title} className="poster-img" />
        <button
          className={`bookmark-btn ${movie.isBookmarked ? "active" : ""}`}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label="북마크 토글"
        >
          <svg
            width="14"
            height="16"
            viewBox="0 0 16 18"
            fill={movie.isBookmarked ? "#ffffff" : "none"}
            stroke="#ffffff"
            strokeWidth="2"
          >
            <path d="M1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V17L8 13.5L1 17V3Z" />
          </svg>
        </button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-date">{movie.releaseDate}</p>
      </div>
    </div>
  );
}