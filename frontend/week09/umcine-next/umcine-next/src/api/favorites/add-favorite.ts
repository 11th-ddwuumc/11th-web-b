import { authApi } from "../auth-api";

export interface AddFavoriteRequest {
  movieId: number;
}

interface AddFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    favoriteId: number;
    movieId: number;
    createdAt: string;
  };
}

export async function addFavorite(
  body: AddFavoriteRequest,
) {
  const response = await authApi
    .post("favorites", { json: body })
    .json<AddFavoriteResponse>();

  return response.result;
}