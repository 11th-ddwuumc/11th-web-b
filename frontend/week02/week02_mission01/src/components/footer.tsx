import './footer.css'

function Footer() {
  return (
    <footer className="footer">
      <img src="/images/logos/tmdb-logo.svg" alt="TMDB" width={24} height={24} />
      <span className="footer__text">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </span>
    </footer>
  )
}

export default Footer
