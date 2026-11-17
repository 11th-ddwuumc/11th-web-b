
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useProfileStore } from "../../stores/profile-store";
import { useFavoritesQuery } from "../../hooks/use-favorites-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MyPage() {
  const nickname = useProfileStore((state) => state.nickname);
  const email = useProfileStore((state) => state.email);
  const imageUrl = useProfileStore((state) => state.imageUrl);

  const favoritesQuery = useFavoritesQuery();

  const favoriteMovies = useQueries({
    queries: (favoritesQuery.data ?? []).map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetail(favorite.movieId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  return (
    <main className="mx-auto min-h-[calc(100dvh-165px)] max-w-[1126px] px-5 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">내 정보</h1>

        <Link
          to="/mypage/edit"
          className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-t border-gray-200 pt-6">
        <h2 className="mb-6 text-base font-bold">기본 정보</h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          <img
            src={imageUrl || "/icons/person.svg"}
            alt="프로필 이미지"
            className={`h-20 w-20 shrink-0 rounded-full bg-gray-200 object-cover ${
              imageUrl ? "" : "p-4"
            }`}
          />

          <dl className="grid flex-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="mb-2 text-xs text-gray-500">닉네임</dt>
              <dd className="break-words text-sm font-semibold">
                {nickname}
              </dd>
            </div>

            <div>
              <dt className="mb-2 text-xs text-gray-500">이메일</dt>
              <dd className="break-all text-sm font-semibold">
                {email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-10 border-t border-gray-200 pt-6">
        <h2 className="mb-6 text-base font-bold">
          즐겨찾기 영화
        </h2>

        {favoritesQuery.isPending ? (
          <p className="py-10 text-center text-sm text-gray-500">
            즐겨찾기를 불러오는 중...
          </p>
        ) : favoritesQuery.isError ? (
          <p className="py-10 text-center text-sm text-red-500">
            즐겨찾기를 불러오지 못했어요.
          </p>
        ) : favoritesQuery.data.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            즐겨찾기한 영화가 없어요.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {favoritesQuery.data.map((favorite, index) => {
              const movie = favoriteMovies[index]?.data;

              return (
                <Link
                  key={favorite.favoriteId}
                  to="/movies/$movieId"
                  params={{ movieId: String(favorite.movieId) }}
                  className="min-w-0"
                >
                  {movie ? (
                    <>
                      <img
                        src={
                          getTmdbPosterUrl(movie.poster_path) ??
                          "/icons/person.svg"
                        }
                        alt={`${movie.title} 포스터`}
                        className="aspect-[2/3] w-full rounded-lg bg-gray-200 object-cover"
                      />
                      <h3 className="mt-2 truncate text-sm font-bold">
                        {movie.title}
                      </h3>
                    </>
                  ) : favoriteMovies[index]?.isError ? (
                    <div className="flex aspect-[2/3] items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                      영화 정보를 불러오지 못했어요.
                    </div>
                  ) : (
                    <div className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
