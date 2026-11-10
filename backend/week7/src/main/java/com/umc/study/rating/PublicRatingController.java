package com.umc.study.rating;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/members/{memberId}/ratings")
public class PublicRatingController {
    private final RatingService ratingService;
    public PublicRatingController(RatingService ratingService) { this.ratingService = ratingService; }

    @GetMapping
    List<RatingResponse> findAll(@PathVariable Long memberId) { return ratingService.findAll(memberId); }
}
