package com.umc.study.rating;

public record RatingResponse(Long ratingId, Long movieId, Integer score, String comment) {
    static RatingResponse from(Rating rating) {
        return new RatingResponse(rating.getId(), rating.getMovieId(), rating.getScore(), rating.getComment());
    }
}
