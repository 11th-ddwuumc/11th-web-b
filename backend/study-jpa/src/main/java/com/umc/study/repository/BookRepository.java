package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // book_id 기준으로 내림차순 정렬하여 전체 도서 목록을 조회하는 메서드
    List<Book> findAllByOrderByBookIdDesc();
}