package com.umc.study.favorite;

import com.umc.study.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import static com.umc.study.config.SwaggerConfig.BEARER_AUTH;

@RestController
@RequestMapping("/favorites")
@SecurityRequirement(name = BEARER_AUTH)
@io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "401", description = "AUTH401_2 인증 필요 / AUTH401_3 유효하지 않은 토큰")
class FavoriteController {
    private final FavoriteService favorites;

    FavoriteController(FavoriteService favorites) {
        this.favorites = favorites;
    }

    @PostMapping
    @Operation(summary = "즐겨찾기 등록", description = "현재 회원의 즐겨찾기에 영화를 추가합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 등록 완료")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 요청 값 오류")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "FAVORITE409_1 중복 등록",
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                    {"isSuccess":false,"code":"FAVORITE409_1","message":"이미 즐겨찾기한 영화입니다.","result":null}
                    """)))
    ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @RequestAttribute Long memberId, @Valid @RequestBody CreateFavoriteRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(
                "즐겨찾기를 등록했습니다.", favorites.create(memberId, request.movieId())));
    }

    @GetMapping
    @Operation(summary = "내 즐겨찾기 목록 조회", description = "현재 회원의 즐겨찾기를 최신 등록순으로 조회합니다.")
    ApiResponse<List<FavoriteResponse>> findAll(@RequestAttribute Long memberId) {
        return ApiResponse.ok("즐겨찾기를 조회했습니다.", favorites.findAll(memberId));
    }

    @GetMapping("/{movieId}")
    @Operation(summary = "즐겨찾기 여부 조회", description = "현재 회원이 해당 영화를 즐겨찾기했는지 조회합니다.")
    ApiResponse<FavoriteStatus> getStatus(@RequestAttribute Long memberId, @PathVariable Long movieId) {
        return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", new FavoriteStatus(favorites.isFavorite(memberId, movieId)));
    }

    @DeleteMapping("/{movieId}")
    @Operation(summary = "즐겨찾기 해제", description = "현재 회원의 즐겨찾기에서 영화를 제거합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "FAVORITE404_1 즐겨찾기 없음")
    ApiResponse<Void> delete(@RequestAttribute Long memberId, @PathVariable Long movieId) {
        favorites.delete(memberId, movieId);
        return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
    }

    record CreateFavoriteRequest(
            @NotNull @Positive @io.swagger.v3.oas.annotations.media.Schema(example = "550") Long movieId) {}

    record FavoriteStatus(boolean isFavorite) {}
}
