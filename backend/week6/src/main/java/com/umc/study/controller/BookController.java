package com.umc.study.controller;

import com.umc.study.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Map<String, Object>> getBooks() {
        return bookService.getBooks();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBook(
            @RequestBody Map<String, Object> request
    ) {
        int affectedRows = bookService.createBook(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "책이 등록되었습니다.",
                        "affectedRows", affectedRows
                ));
    }

    @GetMapping("/category/{categoryId}")
    public List<Map<String, Object>> getBooksByCategory(
            @PathVariable Long categoryId
    ) {
        return bookService.getBooksByCategory(categoryId);
    }
}