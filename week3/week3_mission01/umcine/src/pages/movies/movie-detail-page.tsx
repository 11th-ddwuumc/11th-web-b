import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export default function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  const movie = movieDetailQuery.data;

  // 1. 유효하지 않은 영화 ID 상태
  if (!isValidMovieId) {
    return (
      <div className="movie-detail-empty">
        <p role="alert">올바르지 않은 영화 번호예요.</p>
        <Link to="/">영화 목록으로 돌아가기</Link>
      </div>
    );
  }

  // 2. 로딩 상태
  if (movieDetailQuery.isPending) {
    return (
      <div className="movie-detail-empty" role="status">
        <p>영화 상세 정보를 불러오는 중이에요.</p>
      </div>
    );
  }

  // 3. 오류 상태
  if (movieDetailQuery.isError) {
    return (
      <div className="movie-detail-empty">
        <p role="alert">{getMovieDetailErrorMessage(movieDetailQuery.error)}</p>
        <Link to="/">영화 목록으로 돌아가기</Link>
      </div>
    );
  }

  // 4. 데이터가 없을 경우 (혹은 성공했으나 데이터가 비어있는 경우)
  if (!movie) {
    return (
      <div className="movie-detail-empty">
        <p role="alert">영화를 찾을 수 없어요.</p>
        <Link to="/">영화 목록으로 돌아가기</Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  // 5. 성공 상태 (기존 상세 UI 유지)
  return (
    <div className="movie-detail-page">
      <section className="detail-stage">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="detail-backdrop"
          />
        )}

        <div className="detail-overlay">
          <Link to="/" className="back-link">
            <span className="back-arrow">‹</span>
            <span>영화 목록</span>
          </Link>

          <div className="detail-copy">
            <h1>{movie.title}</h1>

            <p className="original-title">{movie.original_title}</p>

            <div className="detail-meta">
              <span>{movie.release_date || "개봉일 정보 없음"}</span>

              <span>·</span>

              <span>
                {movie.genres.map((genre) => genre.name).join(" · ") ||
                  "장르 정보 없음"}
              </span>

              <span>·</span>

              <span>
                {movie.runtime ? `${movie.runtime}분` : "상영시간 정보 없음"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="detail-container">
        <div className="detail-poster">
          {posterUrl ? (
            <img src={posterUrl} alt={`${movie.title} 포스터`} />
          ) : (
            <div className="poster-placeholder">포스터가 없습니다.</div>
          )}
        </div>

        <section className="synopsis">
          {movie.tagline && <h2>{movie.tagline}</h2>}

          <p>{movie.overview || "등록된 줄거리가 없습니다."}</p>

          <button type="button" className="favorite-button">
            ♡ 즐겨찾기
          </button>
        </section>

        <aside className="rating-panel">
          <h2>내 평점</h2>

          <p className="rating-help">별점을 눌러 평점을 남겨보세요.</p>

          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((score) => (
              <button key={score} type="button" aria-label={`${score}점`}>
                ★
              </button>
            ))}
          </div>

          <textarea aria-label="한줄평" placeholder="한줄평을 남겨보세요." />

          <button type="button" className="save-rating">
            평점 저장
          </button>
        </aside>
      </main>
    </div>
  );
}
