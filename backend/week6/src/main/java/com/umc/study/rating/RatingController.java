package com.umc.study.rating;

import com.umc.study.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/members/{memberId}/ratings")
public class RatingController {
    private final RatingService ratingService;
    public RatingController(RatingService ratingService) { this.ratingService = ratingService; }
    @GetMapping
    List<RatingResponse> findAll(@PathVariable Long memberId) { return ratingService.findAll(memberId); }
    @PostMapping
    ResponseEntity<ApiResponse<Long>> create(@PathVariable Long memberId, @Valid @RequestBody CreateRatingRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created("평점 등록에 성공했습니다.", ratingService.create(memberId, request)));
    }
    @PatchMapping("/{ratingId}")
    ApiResponse<Void> update(@PathVariable Long memberId, @PathVariable Long ratingId, @Valid @RequestBody UpdateRatingRequest request) {
        ratingService.update(memberId, ratingId, request);
        return ApiResponse.ok("평점 수정에 성공했습니다.", null);
    }
    @DeleteMapping("/{ratingId}")
    ResponseEntity<Void> delete(@PathVariable Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.noContent().build();
    }
}
