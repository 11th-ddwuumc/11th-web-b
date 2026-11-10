package com.umc.study.rating;

import com.umc.study.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ratings")
public class RatingController {
    private final RatingService ratingService;
    public RatingController(RatingService ratingService) { this.ratingService = ratingService; }
    @PostMapping
    ResponseEntity<ApiResponse<RatingResponse>> create(@RequestAttribute Long memberId, @Valid @RequestBody CreateRatingRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created("평점 등록에 성공했습니다.", ratingService.create(memberId, request)));
    }
    @PatchMapping("/{ratingId}")
    ApiResponse<Void> update(@RequestAttribute Long memberId, @PathVariable Long ratingId, @Valid @RequestBody UpdateRatingRequest request) {
        ratingService.update(memberId, ratingId, request);
        return ApiResponse.ok("평점 수정에 성공했습니다.", null);
    }
    @DeleteMapping("/{ratingId}")
    ApiResponse<Void> delete(@RequestAttribute Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ApiResponse.ok("평점 삭제에 성공했습니다.", null);
    }
}
