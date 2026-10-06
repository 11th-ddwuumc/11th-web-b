export function Pagination() {
  return (
    <footer className="mt-10 flex items-center justify-end gap-2 pb-5 text-[11px] text-gray-400">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt="TMDB Logo"
        className="h-auto w-6 object-contain"
      />

      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}