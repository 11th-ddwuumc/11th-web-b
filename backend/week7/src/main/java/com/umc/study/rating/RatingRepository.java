package com.umc.study.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    boolean existsByMemberIdAndMovieId(Long memberId, Long movieId);
    List<Rating> findAllByMemberIdOrderByIdDesc(Long memberId);
}
