package com.umc.study.controller;

import com.umc.study.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(
            @RequestBody Map<String, Object> request
    ) {
        int affectedRows = rentalService.createRental(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "대여가 등록되었습니다.",
                        "affectedRows", affectedRows
                ));
    }

    @PatchMapping("/{rentalId}/return")
    public ResponseEntity<Map<String, Object>> returnRental(
            @PathVariable Long rentalId
    ) {
        int affectedRows = rentalService.returnRental(rentalId);

        return ResponseEntity.ok(Map.of(
                "message", "반납이 완료되었습니다.",
                "affectedRows", affectedRows
        ));
    }
}