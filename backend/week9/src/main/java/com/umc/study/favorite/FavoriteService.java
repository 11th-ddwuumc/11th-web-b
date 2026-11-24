package com.umc.study.favorite;

import com.umc.study.common.ApiException;
import com.umc.study.member.Member;
import com.umc.study.member.MemberRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
class FavoriteService {
    private final FavoriteRepository favorites;
    private final MemberRepository members;

    FavoriteService(FavoriteRepository favorites, MemberRepository members) {
        this.favorites = favorites;
        this.members = members;
    }

    @Transactional
    FavoriteResponse create(Long memberId, Long movieId) {
        Member member = members.findById(memberId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "존재하지 않는 회원입니다."));
        if (favorites.existsByMemberIdAndMovieId(memberId, movieId)) {
            throw duplicateFavorite();
        }
        try {
            return FavoriteResponse.from(favorites.saveAndFlush(new Favorite(member, movieId)));
        } catch (DataIntegrityViolationException exception) {
            if (exception.getCause() instanceof org.hibernate.exception.ConstraintViolationException violation
                    && violation.getConstraintName() != null
                    && violation.getConstraintName().toLowerCase(java.util.Locale.ROOT).contains("uk_favorite_member_movie")) {
                throw duplicateFavorite();
            }
            throw exception;
        }
    }

    @Transactional(readOnly = true)
    List<FavoriteResponse> findAll(Long memberId) {
        return favorites.findAllByMemberIdOrderByIdDesc(memberId)
                .stream().map(FavoriteResponse::from).toList();
    }

    @Transactional(readOnly = true)
    boolean isFavorite(Long memberId, Long movieId) {
        return favorites.existsByMemberIdAndMovieId(memberId, movieId);
    }

    @Transactional
    void delete(Long memberId, Long movieId) {
        Favorite favorite = favorites.findByMemberIdAndMovieId(memberId, movieId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "FAVORITE404_1", "즐겨찾기를 찾을 수 없습니다."));
        favorites.delete(favorite);
    }

    private ApiException duplicateFavorite() {
        return new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1", "이미 즐겨찾기한 영화입니다.");
    }
}
