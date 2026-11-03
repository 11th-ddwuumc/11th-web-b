package com.umc.study.member;

import com.umc.study.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    public MemberService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository; this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    public Long signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.email()))
            throw new ApiException(HttpStatus.CONFLICT, "MEMBER4091", "이미 사용 중인 이메일입니다.");
        if (memberRepository.existsByNickname(request.nickname()))
            throw new ApiException(HttpStatus.CONFLICT, "MEMBER4092", "이미 사용 중인 닉네임입니다.");
        return memberRepository.save(new Member(request.email(), request.nickname(), passwordEncoder.encode(request.password()))).getId();
    }
}
