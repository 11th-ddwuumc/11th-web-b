package com.umc.study.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignUpRequest(
        @NotBlank @Email(message = "올바른 이메일 형식이 필요합니다.") String email,
        @NotBlank @Size(min = 2, max = 20, message = "닉네임은 2~20자로 입력해주세요.") String nickname,
        @NotBlank @Size(min = 8, max = 72, message = "비밀번호는 8~72자로 입력해주세요.")
        @Pattern(regexp = ".*[A-Za-z].*", message = "비밀번호에 영문자를 포함해주세요.") String password
) {}
