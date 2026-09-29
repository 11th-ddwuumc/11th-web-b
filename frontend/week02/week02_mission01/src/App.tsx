import { useState } from "react";
import { movies as initialMovies } from "./data/movies";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import "./App.css";

function App() {
  const [movies, setMovies] = useState(initialMovies);

  // 불변성을 지키며 배열 상태 업데이트
  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <h1 className="page-title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      </main>
      <Pagination />
    </div>
  );
}

export default App;