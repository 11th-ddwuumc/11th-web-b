package com.umc.study.favorite;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByMemberIdAndMovieId(Long memberId, Long movieId);
    List<Favorite> findAllByMemberIdOrderByIdDesc(Long memberId);
    Optional<Favorite> findByMemberIdAndMovieId(Long memberId, Long movieId);
}
