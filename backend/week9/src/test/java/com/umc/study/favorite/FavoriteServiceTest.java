package com.umc.study.favorite;

import com.umc.study.common.ApiException;
import com.umc.study.member.Member;
import com.umc.study.member.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {
    @Mock FavoriteRepository favorites;
    @Mock MemberRepository members;
    @InjectMocks FavoriteService service;

    @BeforeEach
    void setUp() {
        when(members.findById(1L)).thenReturn(Optional.of(new Member("favorite@example.com", "즐겨찾기", "unused")));
    }

    @Test
    void 신규_영화는_즐겨찾기에_저장한다() {
        when(favorites.saveAndFlush(any(Favorite.class))).thenAnswer(call -> call.getArgument(0));

        FavoriteResponse response = service.create(1L, 550L);

        assertThat(response.movieId()).isEqualTo(550L);
        verify(favorites).saveAndFlush(any(Favorite.class));
    }

    @Test
    void 이미_등록된_영화는_409를_던지고_저장하지_않는다() {
        when(favorites.existsByMemberIdAndMovieId(1L, 550L)).thenReturn(true);

        assertThatExceptionOfType(ApiException.class)
                .isThrownBy(() -> service.create(1L, 550L))
                .satisfies(error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(error.getCode()).isEqualTo("FAVORITE409_1");
                });
        verify(favorites, never()).saveAndFlush(any());
    }
}
