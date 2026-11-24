package com.umc.study.member;

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
    ApiResponse<MemberInfoResponse> getMyInfo(@RequestAttribute Long memberId) {
        return ApiResponse.ok("회원 정보를 조회했습니다.", memberService.getMyInfo(memberId));
    }

    @PatchMapping("/me")
    ApiResponse<MemberInfoResponse> updateMyInfo(@RequestAttribute Long memberId,
                                                  @Valid @RequestBody MemberUpdateRequest request) {
        return ApiResponse.ok("회원 정보를 수정했습니다.", memberService.updateMyInfo(memberId, request));
    }
}
