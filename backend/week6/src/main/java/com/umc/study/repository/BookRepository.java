package com.umc.study.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class BookRepository {

    private final JdbcTemplate jdbcTemplate;

    public BookRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findAll() {
        String sql = """
                SELECT book_id, category_id, title, description, is_available
                FROM book
                ORDER BY book_id
                """;

        return jdbcTemplate.queryForList(sql);
    }

    public int save(Map<String, Object> book) {
        String sql = """
                INSERT INTO book (
                    category_id,
                    title,
                    description,
                    is_available
                )
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                book.get("categoryId"),
                book.get("title"),
                book.get("description"),
                book.getOrDefault("isAvailable", true)
        );
    }
    public List<Map<String, Object>> findByCategoryId(Long categoryId) {
        String sql = """
            SELECT book_id, category_id, title, description, is_available
            FROM book
            WHERE category_id = ?
            ORDER BY book_id
            """;

        return jdbcTemplate.queryForList(sql, categoryId);
    }
}