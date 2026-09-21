export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <img src="/icons/movie.svg" alt="UMCine Logo" className="logo-icon" />
          </div>
          <nav className="nav-links">
            <a href="#" className="active">영화</a>
            <a href="#">검색</a>
            <a href="#">내 정보</a>
          </nav>
        </div>
        <div className="header-right">
          <button className="search-btn" aria-label="검색">
            <img src="/icons/search.svg" alt="Search" />
          </button>
          <button className="login-btn">로그인</button>
        </div>
      </div>
    </header>
  );
}