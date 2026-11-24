import type { Movie, MoviePage } from "../types/movie";

async function request<T>(params: URLSearchParams): Promise<T> {
  const response = await fetch(`/api/movies?${params}`);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "영화 정보를 불러오지 못했어요.");
  }
  return response.json() as Promise<T>;
}

export function getMovies({ page }: { page: number }) {
  return request<MoviePage>(new URLSearchParams({ page: String(page) }));
}

export function searchMovies({ query, page = 1 }: { query: string; page?: number }) {
  return request<MoviePage>(new URLSearchParams({ query, page: String(page) }));
}

export function getMovieDetail(movieId: number) {
  return request<Movie>(new URLSearchParams({ movieId: String(movieId) }));
}
