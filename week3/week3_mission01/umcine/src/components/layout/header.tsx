import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <a href="#" className="logo">
          <span className="logo-badge">UM</span>Cine
        </a>

        <nav>
          <ul className="nav-menu">
            <li className="nav-item active">
              <Link to="/">영화</Link>
            </li>

            <li className="nav-item">
              <Link to="/search">검색</Link>
            </li>

            <li className="nav-item">
              <Link to="/my-page">내 정보</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="header-right">
        <button type="button" className="search-icon-btn">
          🔍
        </button>

        <Link to="/login" className="login-btn">
          로그인
        </Link>
      </div>
    </header>
  );
}
