
import { authApi } from "../auth-api";
import type { Rating } from "./get-member-ratings";

export interface UpdateRatingRequest {
  score: number;
  comment: string;
}

interface RatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

export async function updateRating(
  ratingId: number,
  body: UpdateRatingRequest,
): Promise<Rating> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingResponse>();

  return response.result;
}
