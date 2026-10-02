package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM rental";

        // DB의 모든 대여 기록을 List<Map> 형태로 조회합니다.
        return jdbcTemplate.queryForList(sql);
    }

    public void save(Map<String, Object> body){
        //rental_id: AUTO_INCREMENT (생략)
        //returned_at: 반납 전이므로 NULL 상태 유지 (생략)
        String sql = "INSERT INTO rental(user_id, book_id, rented_at, due_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";

        jdbcTemplate.update(
                sql,
                body.get("user_id"),
                body.get("book_id")
        );
    }
}