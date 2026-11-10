package com.umc.study.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public RentalRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int save(Map<String, Object> rental) {
        String sql = """
                INSERT INTO rental (
                    user_id,
                    book_id,
                    rented_at,
                    due_at,
                    returned_at
                )
                VALUES (
                    ?,
                    ?,
                    NOW(),
                    DATE_ADD(NOW(), INTERVAL 7 DAY),
                    NULL
                )
                """;

        return jdbcTemplate.update(
                sql,
                rental.get("userId"),
                rental.get("bookId")
        );
    }

    public int returnBook(Long rentalId) {
        String sql = """
            UPDATE rental
            SET returned_at = NOW()
            WHERE rental_id = ?
            """;

        return jdbcTemplate.update(sql, rentalId);
    }
}