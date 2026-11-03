function Footer() {
  return (
    <footer className="flex h-[57px] items-center justify-center gap-2 border-t border-line bg-surface">
      <img src="/images/logos/tmdb-logo.svg" alt="TMDB" width={24} height={24} />
      <span className="text-[12px] leading-[14px] text-faint">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </span>
    </footer>
  );
}

export default Footer;
