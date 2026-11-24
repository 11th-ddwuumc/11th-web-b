import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore((state) =>
  state.bookmarkedMovieIds.includes(movie.id),
);

const toggleBookmark = useBookmarkStore(
  (state) => state.toggleBookmark,
);
  return (
    <article className="min-w-0">
      <div className="relative aspect-[1/1.15] overflow-hidden rounded-xl bg-gray-200">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
          className="block h-full w-full"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover transition duration-200 hover:scale-[1.02]"
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute right-2.5 top-2.5 z-10 flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white bg-black/40 backdrop-blur-sm transition",
            isBookmarked && "border-transparent bg-blue-600",
          )}
          onClick={() => toggleBookmark(movie.id)}
          aria-label={
            isBookmarked ? "북마크 해제" : "북마크"
          }
        >
          <img
            src={
              isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="h-[18px] w-[18px] brightness-0 invert"
          />
        </button>
      </div>

      <div className="mt-2 text-left">
        <h3 className="truncate text-sm font-bold text-gray-900">
          {movie.title}
        </h3>

        <p className="mt-0.5 text-xs text-gray-500">
          {movie.releaseDate}
        </p>
      </div>
    </article>
  );
}