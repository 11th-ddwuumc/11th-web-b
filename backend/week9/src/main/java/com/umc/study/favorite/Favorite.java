package com.umc.study.favorite;

import com.umc.study.member.Member;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(
        name = "uk_favorite_member_movie", columnNames = {"member_id", "movie_id"}))
class Favorite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    protected Favorite() {}

    Favorite(Member member, Long movieId) {
        this.member = member;
        this.movieId = movieId;
    }

    Long getId() { return id; }
    Long getMovieId() { return movieId; }
    LocalDateTime getCreatedAt() { return createdAt; }
}
