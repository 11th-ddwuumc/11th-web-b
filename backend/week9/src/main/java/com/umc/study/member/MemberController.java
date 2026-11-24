package com.umc.study.member;

import com.umc.study.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.umc.study.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/members")
public class MemberController {
    private final MemberService memberService;
    public MemberController(MemberService memberService) { this.memberService = memberService; }
    @PostMapping
    @Operation(summary = "회원가입", description = "이메일, 닉네임, 비밀번호로 회원을 등록합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 가입 완료")
    ResponseEntity<ApiResponse<Long>> signUp(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created("회원가입에 성공했습니다.", memberService.signUp(request)));
    }

    @GetMapping("/email/{email}")
    DuplicateCheckResponse checkEmail(@PathVariable String email) {
        return new DuplicateCheckResponse(!memberService.existsByEmail(email));
    }

    @GetMapping("/nickname/{nickname}")
    DuplicateCheckResponse checkNickname(@PathVariable String nickname) {
        return new DuplicateCheckResponse(!memberService.existsByNickname(nickname));
    }

    @GetMapping("/me")
    @Operation(summary = "내 정보 조회", description = "현재 회원의 프로필을 조회합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 인증 필요 / AUTH401_3 유효하지 않은 토큰")
    ApiResponse<MemberInfoResponse> getMyInfo(@RequestAttribute Long memberId) {
        return ApiResponse.ok("회원 정보를 조회했습니다.", memberService.getMyInfo(memberId));
    }

    @PatchMapping("/me")
    @Operation(summary = "내 정보 수정", description = "현재 회원의 닉네임을 수정합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 인증 필요 / AUTH401_3 유효하지 않은 토큰")
    ApiResponse<MemberInfoResponse> updateMyInfo(@RequestAttribute Long memberId,
                                                  @Valid @RequestBody MemberUpdateRequest request) {
        return ApiResponse.ok("회원 정보를 수정했습니다.", memberService.updateMyInfo(memberId, request));
    }
}
