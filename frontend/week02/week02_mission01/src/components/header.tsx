import './header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__brand-row">
        <div className="header__brand">
          <span className="header__mark">
            <img src="/icons/movie.svg" alt="" className="header__mark-icon" />
          </span>
          <span className="header__brand-name">UMCine</span>
        </div>
        <nav className="header__nav">
          <ul>
            <li>
              <a href="#" className="header__nav-link header__nav-link--active">
                영화
              </a>
            </li>
            <li>
              <a href="#" className="header__nav-link">
                검색
              </a>
            </li>
            <li>
              <a href="#" className="header__nav-link">
                내 정보
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="header__actions">
        <button type="button" className="header__search-button" aria-label="영화 검색">
          <img src="/icons/search.svg" alt="" width={24} height={24} />
        </button>
        <button type="button" className="header__login-button">
          로그인
        </button>
      </div>
    </header>
  )
}

export default Header
