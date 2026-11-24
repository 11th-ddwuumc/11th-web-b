"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";


import { cn } from "../../utils/cn";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getFavoriteStatus } from "../../api/favorites/get-favorite-status";
import { addFavorite } from "../../api/favorites/add-favorite";
import { deleteFavorite } from "../../api/favorites/delete-favorite";
import { createRating } from "../../api/ratings/create-rating";
import { updateRating } from "../../api/ratings/update-rating";
import { deleteRating } from "../../api/ratings/delete-rating";
import { useAuthStore } from "../../stores/auth-store";

import type { Movie } from "../../types/movie";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage({ movieIdParam }: { movieIdParam: string }) {

  const movieId = Number(movieIdParam);
  const isValidMovieId =
    Number.isInteger(movieId) && movieId > 0;

  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [ratingId, setRatingId] = useState<number | null>(null);

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  const favoriteQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: isValidMovieId && Boolean(accessToken),
    retry: false,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: () => addFavorite({ movieId }),
    onSuccess: () => {
      queryClient.setQueryData(["favorites", movieId], true);
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: () => deleteFavorite(movieId),
    onSuccess: () => {
      queryClient.setQueryData(["favorites", movieId], false);
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const createRatingMutation = useMutation({
    mutationFn: () =>
      createRating({
        movieId,
        score,
        comment,
      }),
    onSuccess: (rating) => {
      setRatingId(rating.ratingId);
      alert("평점이 등록되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });
    },
    onError: () => {
      alert("평점 등록에 실패했습니다.");
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: () => {
      if (ratingId === null) {
        throw new Error("수정할 평점이 없습니다.");
      }

      return updateRating(ratingId, {
        score,
        comment,
      });
    },
    onSuccess: () => {
      alert("평점이 수정되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });
    },
    onError: () => {
      alert("평점 수정에 실패했습니다.");
    },
  });

  const deleteRatingMutation = useMutation({
    mutationFn: () => {
      if (ratingId === null) {
        throw new Error("삭제할 평점이 없습니다.");
      }

      return deleteRating(ratingId);
    },
    onSuccess: () => {
      setRatingId(null);
      setScore(5);
      setComment("");
      alert("평점이 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });
    },
    onError: () => {
      alert("평점 삭제에 실패했습니다.");
    },
  });

  const isBookmarked = favoriteQuery.data ?? false;

  const isFavoritePending =
    favoriteQuery.isPending ||
    addFavoriteMutation.isPending ||
    deleteFavoriteMutation.isPending;

  const isRatingPending =
    createRatingMutation.isPending ||
    updateRatingMutation.isPending ||
    deleteRatingMutation.isPending;

  const handleFavoriteClick = () => {
    if (!accessToken) {
      alert("로그인 후 이용할 수 있어요.");
      return;
    }

    if (isBookmarked) {
      deleteFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  const handleRatingSubmit = () => {
    if (!accessToken) {
      alert("로그인 후 이용할 수 있어요.");
      return;
    }

    if (comment.length > 500) {
      alert("한줄평은 500자 이하로 작성해 주세요.");
      return;
    }

    if (ratingId !== null) {
      updateRatingMutation.mutate();
    } else {
      createRatingMutation.mutate();
    }
  };

  if (!isValidMovieId) {
    return (
      <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-4 bg-[#f7f8fa]">
        <p className="text-lg font-semibold text-gray-700">
          올바르지 않은 영화 ID예요.
        </p>
        <Link href="/" className="text-sm font-semibold text-blue-600">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-[#f7f8fa]">
        <p className="text-gray-600">
          영화 정보를 불러오는 중...
        </p>
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-4 bg-[#f7f8fa]">
        <p className="text-lg font-semibold text-gray-700">
          영화 정보를 불러오지 못했어요.
        </p>
        <Link href="/" className="text-sm font-semibold text-blue-600">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const response = movieDetailQuery.data;

  const movie: Movie = {
    id: response.id,
    title: response.title,
    originalTitle: response.original_title,
    releaseDate: response.release_date
      ? response.release_date.replaceAll("-", ".")
      : "개봉일 정보 없음",
    posterPath: getTmdbPosterUrl(response.poster_path) ?? "",
    backdropPath: getTmdbBackdropUrl(response.backdrop_path) ?? "",
    genres: response.genres.map((genre) => genre.name),
    runtime: response.runtime
      ? `${response.runtime}분`
      : "러닝타임 정보 없음",
    tagline: response.tagline,
    overview: response.overview,
    isBookmarked: false,
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-white">
      <section className="relative h-[430px] overflow-hidden bg-gray-800">
        {movie.backdropPath && (
          <img
            src={movie.backdropPath}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1126px] px-5 pb-12">
          <Link
            href="/"
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
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1126px] gap-8 px-5 py-8 md:grid-cols-[180px_1fr_260px]">
        {movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-44 rounded-lg object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-64 w-44 items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
            포스터 없음
          </div>
        )}

        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-900">
            {movie.title}을(를) 확인해 보세요!
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            {movie.originalTitle}
          </p>

          <div className="mt-6 border-t border-gray-200 pt-5">
            {movie.tagline && (
              <p className="text-lg font-bold text-gray-900">
                {movie.tagline}
              </p>
            )}

            <p className="mt-4 text-sm leading-7 text-gray-600">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>

            <button
              type="button"
              onClick={handleFavoriteClick}
              disabled={Boolean(accessToken) && isFavoritePending}
              className={cn(
                "mt-5 inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition disabled:opacity-60",
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
          <h3 className="font-bold text-gray-900">내 평점</h3>

          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setScore(star)}
                disabled={isRatingPending}
                aria-label={`${star}점`}
                className="text-2xl disabled:opacity-50"
              >
                <span className={star <= score ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              </button>
            ))}
          </div>

          <textarea
            aria-label="한줄평"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={500}
            placeholder="영화에 대한 한줄평을 남겨주세요."
            className="mt-4 h-24 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-400"
          />

          <p className="mt-1 text-right text-xs text-gray-400">
            {comment.length}/500
          </p>

          <button
            type="button"
            onClick={handleRatingSubmit}
            disabled={isRatingPending}
            className="mt-2 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isRatingPending
              ? "처리 중..."
              : ratingId !== null
                ? "평점 수정"
                : "평점 작성"}
          </button>

          {ratingId !== null && (
            <button
              type="button"
              onClick={() => deleteRatingMutation.mutate()}
              disabled={isRatingPending}
              className="mt-2 w-full rounded-lg border border-red-300 py-3 text-sm font-semibold text-red-600 disabled:opacity-50"
            >
              평점 삭제
            </button>
          )}
        </aside>
      </section>
    </main>
  );
}
