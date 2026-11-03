import type { Movie, MoviePage } from "../types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

type TmdbMovie = {
  id: number;
  title: string;
  original_title: string;
  release_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
  tagline?: string;
};

type TmdbPage = { page: number; results: TmdbMovie[]; total_pages: number };

const genreNames: Record<number, string> = {
  28: "액션", 12: "모험", 16: "애니메이션", 35: "코미디", 80: "범죄",
  18: "드라마", 14: "판타지", 27: "공포", 878: "SF", 53: "스릴러",
};

function imageUrl(path: string | null): string {
  return path ? `${IMAGE_BASE_URL}${path}` : "/favicon.svg";
}

function toMovie(movie: TmdbMovie): Movie {
  const genres = movie.genres?.map((genre) => genre.name)
    ?? movie.genre_ids?.map((id) => genreNames[id] ?? "기타")
    ?? [];
  return {
    id: movie.id, title: movie.title, originalTitle: movie.original_title,
    releaseDate: movie.release_date || "개봉일 미정",
    posterPath: imageUrl(movie.poster_path), backdropPath: imageUrl(movie.backdrop_path),
    genres, runtime: movie.runtime ? `${movie.runtime}분` : "상영 시간 정보 없음",
    tagline: movie.tagline || "", overview: movie.overview || "줄거리 정보가 없어요.",
  };
}

async function request<T>(path: string): Promise<T> {
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  if (!token) throw new Error("VITE_TMDB_ACCESS_TOKEN을 .env.local에 설정해 주세요.");
  const response = await fetch(`${TMDB_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
  });
  if (!response.ok) throw new Error(`영화 정보를 불러오지 못했어요. (HTTP ${response.status})`);
  return response.json() as Promise<T>;
}

function toMoviePage(page: TmdbPage): MoviePage {
  return { page: page.page, results: page.results.map(toMovie), totalPages: Math.min(page.total_pages, 500) };
}

export async function getMovies({ page }: { page: number }): Promise<MoviePage> {
  return toMoviePage(await request<TmdbPage>(`/movie/popular?language=ko-KR&page=${page}`));
}

export async function searchMovies({ query, page = 1 }: { query: string; page?: number }): Promise<MoviePage> {
  return toMoviePage(await request<TmdbPage>(`/search/movie?language=ko-KR&query=${encodeURIComponent(query)}&page=${page}`));
}

export async function getMovieDetail(movieId: number): Promise<Movie> {
  return toMovie(await request<TmdbMovie>(`/movie/${movieId}?language=ko-KR`));
}
