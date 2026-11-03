import { useState } from 'react'
import './App.css'
import Header from './components/header'
import MovieGrid from './components/movie-grid'
import Footer from './components/footer'
import { movies as initialMovies } from './data/movies'
import type { Movie } from './types/movie'

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)

  const handleToggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie
      )
    )
  }

  return (
    <div className="app">
      <Header />
      <main className="movie-list-page">
        <h1 className="movie-list-page__title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      </main>
      <Footer />
    </div>
  )
}

export default App
