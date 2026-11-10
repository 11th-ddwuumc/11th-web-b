import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const textLabel = isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(movieId);
      }}
      title={textLabel}
      aria-label={textLabel}
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        border: "none",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isBookmarked ? "#ff4757" : "none"}
        stroke={isBookmarked ? "#ff4757" : "#ffffff"}
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
