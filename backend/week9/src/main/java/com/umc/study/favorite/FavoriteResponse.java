package com.umc.study.favorite;

import java.time.LocalDateTime;

record FavoriteResponse(Long favoriteId, Long movieId, LocalDateTime createdAt) {
    static FavoriteResponse from(Favorite favorite) {
        return new FavoriteResponse(favorite.getId(), favorite.getMovieId(), favorite.getCreatedAt());
    }
}
