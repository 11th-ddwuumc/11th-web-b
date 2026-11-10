export default function TmdbAttribution() {
  return (
    <footer className="detail-footer tmdb-attribution">
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TMDB 홈페이지 (새 창)"
      >
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" width={80} />
      </a>

      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}
