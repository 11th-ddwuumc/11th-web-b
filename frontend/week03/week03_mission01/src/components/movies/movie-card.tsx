import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="relative block aspect-[241.6/274] w-full overflow-hidden rounded-lg bg-line"
      >
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          aria-label={`${movie.title} 즐겨찾기`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleBookmark(movie.id);
          }}
          className="absolute top-[10px] right-[10px] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-surface shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
        >
          <img
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            width={24}
            height={24}
          />
        </button>
      </Link>
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="mt-3 truncate text-[16px] leading-[19px] font-bold text-ink"
      >
        {movie.title}
      </Link>
      <span className="mt-1.5 text-[13px] leading-[15px] font-medium text-faint">
        {movie.releaseDate}
      </span>
    </article>
  );
}

export default MovieCard;
