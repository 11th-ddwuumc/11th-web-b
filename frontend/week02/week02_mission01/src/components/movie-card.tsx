import type { Movie } from '../types/movie'
import './movie-card.css'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (id: number) => void
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="movie-card__poster-image"
        />
        <button
          type="button"
          className="movie-card__bookmark"
          aria-label={`${movie.title} 즐겨찾기`}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="movie-card__title">{movie.title}</div>
      <div className="movie-card__meta">{movie.releaseDate}</div>
    </article>
  )
}

export default MovieCard
