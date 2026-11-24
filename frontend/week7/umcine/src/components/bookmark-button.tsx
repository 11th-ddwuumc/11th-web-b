import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
      className={cn(
        "flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md p-0",
        isBookmarked
          ? "bg-[#2864e8]"
          : "bg-[rgba(22,24,28,0.86)]",
        className,
      )}
      type="button"
      aria-label={
        isBookmarked
          ? `${movieTitle} 북마크 해제`
          : `${movieTitle} 북마크 추가`
      }
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="h-[17px] w-[17px] object-contain"
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
  );
}