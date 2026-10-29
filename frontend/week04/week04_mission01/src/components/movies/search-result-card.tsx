import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { useBookmarkStore } from "../../store/bookmark-store";

interface SearchResultCardProps {
  movie: Movie;
}

const arrowMaskStyle: CSSProperties = {
  WebkitMaskImage: "url(/icons/arrow-right.svg)",
  maskImage: "url(/icons/arrow-right.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

function SearchResultCard({ movie }: SearchResultCardProps) {
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movie.id));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <article className="flex gap-[18px]">
      <div className="relative h-[190px] w-[126px] shrink-0">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-full w-full rounded-lg object-cover"
        />
        <button
          type="button"
          aria-label={`${movie.title} 즐겨찾기`}
          onClick={() => toggleBookmark(movie.id)}
          className="absolute top-[8px] right-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-surface shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
        >
          <img
            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            width={18}
            height={18}
          />
        </button>
      </div>
      <div className="flex-1">
        <h3 className="text-[20px] leading-[25px] font-bold text-ink">{movie.title}</h3>
        <div className="mt-2 flex items-center gap-3 text-[13px] leading-[14px] text-faint">
          <span>{movie.originalTitle}</span>
          <span>{movie.releaseDate}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-[14px] leading-[21px] text-muted">
          {movie.overview}
        </p>
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-brand"
        >
          상세 보기
          <span aria-hidden="true" className="h-4 w-4 bg-brand" style={arrowMaskStyle} />
        </Link>
      </div>
    </article>
  );
}

export default SearchResultCard;
