import Header from "./components/layout/header";
import { MovieListPage } from "./pages/movies/movie-list-page";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <Header />
      {/* 실제 영화 목록과 북마크 로직은 MovieListPage 내부에서 관리합니다 */}
      <MovieListPage />
    </div>
  );
}
