package com.umc.study.rating;

import com.umc.study.common.ApiException;
import com.umc.study.member.Member;
import com.umc.study.member.MemberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {
    @Mock RatingRepository ratings;
    @Mock MemberRepository members;
    @InjectMocks RatingService service;

    @Test
    void 평점_중복_등록은_409와_RATING409_1을_반환한다() {
        Member member = new Member("rating@example.com", "평점회원", "unused");
        when(members.findById(1L)).thenReturn(Optional.of(member));
        when(ratings.existsByMemberIdAndMovieId(1L, 550L)).thenReturn(true);

        assertThatExceptionOfType(ApiException.class)
                .isThrownBy(() -> service.create(1L, new CreateRatingRequest(550L, 5, null)))
                .satisfies(error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(error.getCode()).isEqualTo("RATING409_1");
                });
        verify(ratings, never()).save(any());
    }

    @Test
    void 다른_회원의_평점_수정은_403과_RATING403_1을_반환한다() {
        Member author = mock(Member.class);
        when(author.getId()).thenReturn(2L);
        Rating rating = new Rating(author, 550L, 5, "원래 후기");
        when(ratings.findById(42L)).thenReturn(Optional.of(rating));

        assertThatExceptionOfType(ApiException.class)
                .isThrownBy(() -> service.update(1L, 42L, new UpdateRatingRequest(1, "수정 후기")))
                .satisfies(error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(error.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(5);
        assertThat(rating.getComment()).isEqualTo("원래 후기");
    }
}
