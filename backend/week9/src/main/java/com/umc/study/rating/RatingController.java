package com.umc.study.rating;

import com.umc.study.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.umc.study.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ratings")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 인증 필요 / AUTH401_3 유효하지 않은 토큰")
public class RatingController {
    private final RatingService ratingService;
    public RatingController(RatingService ratingService) { this.ratingService = ratingService; }
    @PostMapping
    @Operation(summary = "평점 등록", description = "현재 회원의 영화 평점을 등록합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 등록 완료")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 요청 값 오류")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 중복 평점")
    ResponseEntity<ApiResponse<RatingResponse>> create(@RequestAttribute Long memberId, @Valid @RequestBody CreateRatingRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created("평점 등록에 성공했습니다.", ratingService.create(memberId, request)));
    }
    @PatchMapping("/{ratingId}")
    @Operation(summary = "평점 수정", description = "현재 회원이 작성한 평점을 수정합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 수정 완료")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 다른 회원의 평점")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점 없음")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 요청 값 오류")
    ApiResponse<Void> update(@RequestAttribute Long memberId, @PathVariable Long ratingId, @Valid @RequestBody UpdateRatingRequest request) {
        ratingService.update(memberId, ratingId, request);
        return ApiResponse.ok("평점 수정에 성공했습니다.", null);
    }
    @DeleteMapping("/{ratingId}")
    @Operation(summary = "평점 삭제", description = "현재 회원이 작성한 평점을 삭제합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 삭제 완료")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 다른 회원의 평점")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점 없음")
    ApiResponse<Void> delete(@RequestAttribute Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ApiResponse.ok("평점 삭제에 성공했습니다.", null);
    }
}
