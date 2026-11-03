package com.umc.study.member;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "members", uniqueConstraints = {
        @UniqueConstraint(name = "uk_member_email", columnNames = "email"),
        @UniqueConstraint(name = "uk_member_nickname", columnNames = "nickname")
})
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100) private String email;
    @Column(nullable = false, length = 30) private String nickname;
    @Column(nullable = false) private String password;
    @Column(nullable = false) private LocalDateTime createdAt = LocalDateTime.now();

    protected Member() {}
    public Member(String email, String nickname, String password) {
        this.email = email; this.nickname = nickname; this.password = password;
    }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getNickname() { return nickname; }
}
