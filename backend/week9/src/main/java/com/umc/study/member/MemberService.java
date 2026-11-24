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

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) { return memberRepository.existsByEmail(email); }

    @Transactional(readOnly = true)
    public boolean existsByNickname(String nickname) { return memberRepository.existsByNickname(nickname); }

    @Transactional(readOnly = true)
    public MemberInfoResponse getMyInfo(Long memberId) {
        return MemberInfoResponse.from(findMember(memberId));
    }

    @Transactional
    public MemberInfoResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
        Member member = findMember(memberId);
        if (memberRepository.existsByNicknameAndIdNot(request.nickname(), memberId)) {
            throw new ApiException(HttpStatus.CONFLICT, "MEMBER409_2", "이미 사용 중인 닉네임입니다.");
        }
        member.updateNickname(request.nickname());
        return MemberInfoResponse.from(member);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다."));
    }
}
