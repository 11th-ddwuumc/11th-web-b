import { BookmarkButton } from "../../components/bookmark-button";

import {
  Link,
  useParams,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/tmdb";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  if (!isValidMovieId) {
    return (
      <main className="mx-auto min-h-[calc(100vh-90px)] w-[1180px] max-w-[calc(100%_-_40px)] py-10 min-[761px]:max-w-[calc(100%_-_80px)]">
        <p className="mb-4 text-xl font-bold">
          영화를 찾을 수 없어요.
        </p>

        <Link className="text-[#2864e8]" to="/">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return <main className="p-10">영화 상세 정보를 불러오는 중이에요.</main>;
  }
  if (movieDetailQuery.isError) {
    return <main className="p-10 text-red-600">{movieDetailQuery.error.message}</main>;
  }
  const movie = movieDetailQuery.data;

  return (
    <main className="relative min-h-[calc(100vh-90px)] overflow-hidden bg-[#171719] text-white">
      <div className="absolute inset-x-0 top-0 h-[420px]">
        <img
          className="h-full w-full object-cover opacity-40"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-[#171719]" />
      </div>

      <div className="relative mx-auto w-[1180px] max-w-[calc(100%_-_40px)] py-10 min-[761px]:max-w-[calc(100%_-_80px)]">
        <Link
          className="mb-6 inline-block text-sm text-white/80"
          to="/"
        >
          ← 영화 목록
        </Link>

        <section className="grid gap-8 md:grid-cols-[240px_1fr]">
          <img
            className="w-full max-w-[240px] rounded-xl object-cover shadow-2xl"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div className="self-end">
            <h1 className="text-4xl font-extrabold">
              {movie.title}
            </h1>

            <p className="mt-2 text-lg text-white/70">
              {movie.originalTitle}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/75">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>

            <BookmarkButton
              className="mt-6"
              movieId={movie.id}
              movieTitle={movie.title}
            />

            <h2 className="mt-8 text-2xl font-bold">
              {movie.tagline}
            </h2>

            <p className="mt-4 max-w-[720px] leading-7 text-white/80">
              {movie.overview}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
