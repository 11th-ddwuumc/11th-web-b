package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // 최신 등록순(bookId 내림차순) 전체 도서 조회
    List<Book> findAllByOrderByBookIdDesc();
}