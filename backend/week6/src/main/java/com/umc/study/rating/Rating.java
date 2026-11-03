package com.umc.study.rating;

import com.umc.study.member.Member;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", uniqueConstraints = @UniqueConstraint(name = "uk_rating_member_movie", columnNames = {"member_id", "movieId"}))
public class Rating {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    @Column(nullable = false) private Long movieId;
    @Column(nullable = false) private Integer score;
    @Column(length = 500) private String comment;
    @Column(nullable = false) private LocalDateTime createdAt = LocalDateTime.now();

    protected Rating() {}
    public Rating(Member member, Long movieId, Integer score, String comment) {
        this.member = member; this.movieId = movieId; this.score = score; this.comment = comment;
    }
    public Long getId() { return id; }
    public Member getMember() { return member; }
    public Long getMovieId() { return movieId; }
    public Integer getScore() { return score; }
    public String getComment() { return comment; }
    public void update(Integer score, String comment) { this.score = score; this.comment = comment; }
}
