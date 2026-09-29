import {
  Link,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const movie = movies.find(
    (item) => item.id === Number(movieId),
  );
  const [isBookmarked, setIsBookmarked] = useState(
  movie?.isBookmarked ?? false,
);

useEffect(() => {
  setIsBookmarked(movie?.isBookmarked ?? false);
}, [movie?.id]);

  if (!movie) {
    return (
      <main className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-[#f7f8fa]">
        <p className="text-lg font-semibold text-gray-700">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-65px)] bg-white">
      <section className="relative h-[430px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1126px] px-5 pb-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
          >
            ← 영화 목록
          </Link>

          <div className="max-w-xl text-left text-white">
            

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {movie.title}
            </h1>

            <p className="mb-2 text-sm text-white/75">
              {movie.originalTitle}
            </p>

            <p className="mt-3 text-sm text-white/80">
              {movie.releaseDate} ·{" "}
              {movie.genres.join(" · ")} ·{" "}
              {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1126px] gap-8 px-5 py-8 md:grid-cols-[180px_1fr_260px]">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="w-44 rounded-lg object-cover shadow-lg"
        />

        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-900">
            {movie.title}을(를) 확인해 보세요!
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            {movie.originalTitle}
          </p>

          <div className="mt-6 border-t border-gray-200 pt-5">
            <p className="text-lg font-bold text-gray-900">
              {movie.tagline}
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              {movie.overview}
            </p>

            <button
  type="button"
  onClick={() => setIsBookmarked((prev) => !prev)}
  className={cn(
    "mt-5 inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition",
    isBookmarked
      ? "border-blue-600 bg-blue-600 text-white"
      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
  )}
>
  <img
    src={
      isBookmarked
        ? "/icons/bookmark.svg"
        : "/icons/bookmark-outline.svg"
    }
    alt=""
    className={cn(
      "h-[18px] w-[18px]",
      isBookmarked && "brightness-0 invert",
    )}
  />
  <span>즐겨찾기</span>
</button>
          </div>

          
        </div>

        <aside className="border-t border-gray-200 pt-5 text-left md:border-l md:border-t-0 md:pl-6">
          <h3 className="font-bold text-gray-900">
            내 평점
          </h3>

          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="text-xl text-gray-300"
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            aria-label="한줄평"
            placeholder="영화에 대한 한줄평을 남겨주세요."
            className="mt-4 h-24 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-400"
          />

          <button
            type="button"
            className="mt-2 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white"
          >
            한줄평 작성
          </button>
        </aside>
      </section>
    </main>
  );
}