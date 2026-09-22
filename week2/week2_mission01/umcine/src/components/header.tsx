export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <a href="#" className="logo">
          <span className="logo-badge">UM</span>Cine
        </a>
        <nav>
          <ul className="nav-menu">
            <li className="nav-item active">영화</li>
            <li className="nav-item">검색</li>
            <li className="nav-item">내 정보</li>
          </ul>
        </nav>
      </div>
      <div className="header-right">
        <button className="search-icon-btn" aria-label="검색">
          🔍
        </button>
        <button className="login-btn">로그인</button>
      </div>
    </header>
  );
}