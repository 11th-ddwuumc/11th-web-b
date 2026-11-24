package com.umc.study.rating;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/members/{memberId}/ratings")
public class PublicRatingController {
    private final RatingService ratingService;
    public PublicRatingController(RatingService ratingService) { this.ratingService = ratingService; }

    @GetMapping
    @Operation(summary = "유저별 평점 조회", description = "회원이 작성한 공개 평점 목록을 조회합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음")
    List<RatingResponse> findAll(@PathVariable Long memberId) { return ratingService.findAll(memberId); }
}
