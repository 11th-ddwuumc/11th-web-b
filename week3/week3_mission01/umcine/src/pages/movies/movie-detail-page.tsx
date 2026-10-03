import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export default function MovieDetailPage() {
  // 1. URL Parameter($movieId) 읽기
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  // 2. ID 비교 (number 변환 후 찾기)
  const movie = movies.find((movie) => movie.id === Number(movieId));

  // 3. 존재하지 않는 영화 ID 예외 처리 (워크북 요구사항 문구 일치)
  if (!movie) {
    return (
      <div className="movie-detail-empty">
        <p>영화를 찾을 수 없어요.</p>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {/* =========================
          상단 영화 배경
      ========================= */}
      <section className="detail-stage">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="detail-backdrop"
        />

        <div className="detail-overlay">
          {/* 영화 목록으로 돌아가기 */}
          <Link to="/" className="back-link">
            <span className="back-arrow">‹</span>
            <span>영화 목록</span>
          </Link>

          {/* 영화 정보 */}
          <div className="detail-copy">
            <h1>{movie.title}</h1>

            <p className="original-title">{movie.originalTitle}</p>

            <div className="detail-meta">
              <span>{movie.releaseDate}</span>
              <span>·</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>·</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          영화 상세 정보
      ========================= */}
      <main className="detail-container">
        {/* 포스터 */}
        <div className="detail-poster">
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </div>

        {/* 줄거리 */}
        <section className="synopsis">
          <h2>{movie.tagline}</h2>

          <p>{movie.overview}</p>

          <button type="button" className="favorite-button">
            ♡ 즐겨찾기
          </button>
        </section>

        {/* 평점 */}
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

          <textarea placeholder="한줄평을 남겨보세요." />

          <button type="button" className="save-rating">
            평점 저장
          </button>
        </aside>
      </main>
    </div>
  );
}
