import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex h-[400px] items-center justify-center px-20">
        <p className="text-[15px] font-medium text-muted">영화를 찾을 수 없어요.</p>
      </main>
    );
  }

  return <MovieDetailContent movie={movie} />;
}

function MovieDetailContent({ movie }: { movie: Movie }) {
  const [isBookmarked, setIsBookmarked] = useState(movie.isBookmarked);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <>
      <section
        className="relative h-[360px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.backdropPath})` }}
      >
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        <div className="relative flex h-full flex-col justify-between px-20 py-6">
          <Link to="/" className="flex w-fit items-center gap-1 text-sm font-semibold text-surface">
            <img src="/icons/chevron-left.svg" alt="" className="h-6 w-6 brightness-0 invert" />
            영화 목록
          </Link>
          <div className="max-w-[800px] pb-[26px]">
            <h1 className="text-[40px] leading-[50px] font-bold text-surface">{movie.title}</h1>
            <p className="mt-2 text-[15px] leading-[17px] text-surface/80">
              {movie.originalTitle}
            </p>
            <div className="mt-2 flex items-center gap-3 text-[14px] leading-[16px] text-surface/80">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex gap-8 px-20 py-6">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[286px] w-[200px] rounded-lg object-cover"
        />
        <section className="w-[656px]">
          <h2 className="text-[20px] leading-[25px] font-bold text-ink">{movie.tagline}</h2>
          <p className="mt-3 text-[15px] leading-[24px] text-muted">{movie.overview}</p>
          <button
            type="button"
            onClick={() => setIsBookmarked((prev) => !prev)}
            className={cn(
              "mt-[22px] flex h-[42px] w-[107px] items-center justify-center gap-2 rounded-md text-sm font-semibold",
              isBookmarked ? "bg-brand text-surface" : "border border-line bg-surface text-ink",
            )}
          >
            <img
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
              className={cn("h-4 w-4", isBookmarked && "brightness-0 invert")}
            />
            즐겨찾기
          </button>
        </section>

        <aside className="w-[360px] rounded-lg border border-line bg-surface p-[31px]">
          <h2 className="text-[20px] leading-[25px] font-bold text-ink">내 평점</h2>
          <p className="mt-2 text-[13px] leading-[14px] text-faint">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="mt-[14px] flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                onClick={() => setRating(value)}
                className="flex h-[38px] w-[38px] items-center justify-center"
              >
                <img
                  src={value <= rating ? "/icons/star.svg" : "/icons/star-outline.svg"}
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
            ))}
          </div>
          <textarea
            value={review}
            onChange={(event) => {
              setReview(event.target.value);
              setSaved(false);
            }}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-4 h-[102px] w-full resize-none rounded-md border border-line px-3 py-2 text-sm text-ink placeholder:text-faint focus:ring-brand focus:outline-none focus:ring-2"
          />
          <button
            type="button"
            disabled={rating === 0}
            onClick={() => setSaved(true)}
            className={cn(
              "mt-[9px] flex h-[42px] w-full items-center justify-center rounded-md text-sm font-semibold text-surface",
              rating === 0 ? "bg-brand-soft" : "bg-brand",
            )}
          >
            {saved ? "저장 완료" : "평점 저장"}
          </button>
        </aside>
      </main>
    </>
  );
}

export default MovieDetailPage;
