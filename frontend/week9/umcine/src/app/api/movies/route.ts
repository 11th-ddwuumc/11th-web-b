import type { NextRequest } from "next/server";
import { getMovieDetail, getMovies, searchMovies } from "../../../server/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const movieIdParam = searchParams.get("movieId");
  const movieId = Number(movieIdParam);
  const page = Number(searchParams.get("page") ?? "1");
  const query = searchParams.get("query")?.trim();

  if (!Number.isInteger(page) || page < 1 || page > 500 ||
      (movieIdParam !== null && (!Number.isSafeInteger(movieId) || movieId < 1))) {
    return Response.json({ message: "요청 값이 올바르지 않아요." }, { status: 400 });
  }

  try {
    if (movieIdParam !== null) return Response.json(await getMovieDetail(movieId));
    if (query) return Response.json(await searchMovies({ query, page }));
    return Response.json(await getMovies({ page }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "영화 정보를 불러오지 못했어요.";
    return Response.json({ message }, { status: 502 });
  }
}
