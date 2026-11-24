package com.umc.study;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class Week9ApiTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper json;
    private String bearer;
    private static final String FAVORITE = """
            {"movieId":550}
            """;
    private static final String RATING = """
            {"movieId":550,"score":5,"comment":"인상 깊었어요"}
            """;

    @BeforeEach
    void signUpAndLogin() throws Exception {
        Map<String, String> credentials = Map.of("email", "week9@example.com", "password", "Practice1!");
        mockMvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("email", credentials.get("email"),
                                "nickname", "9주차회원", "password", credentials.get("password")))))
                .andExpect(status().isCreated());
        var login = mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(credentials)))
                .andExpect(status().isOk()).andReturn();
        bearer = "Bearer " + json.readTree(login.getResponse().getContentAsString())
                .path("result").path("accessToken").asText();
    }

    @Test
    void 토큰_없는_즐겨찾기_등록은_401이다() throws Exception {
        mockMvc.perform(post("/favorites").contentType(MediaType.APPLICATION_JSON).content(FAVORITE))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    void 토큰이_있으면_즐겨찾기가_등록되어_201이다() throws Exception {
        mockMvc.perform(post("/favorites").header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON).content(FAVORITE))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550));
    }

    @Test
    void 즐겨찾기_중복_등록은_409이다() throws Exception {
        var request = post("/favorites").header("Authorization", bearer)
                .contentType(MediaType.APPLICATION_JSON).content(FAVORITE);
        mockMvc.perform(request).andExpect(status().isCreated());
        mockMvc.perform(request)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        mockMvc.perform(get("/favorites").header("Authorization", bearer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.length()").value(1));
    }

    @Test
    void 등록하지_않은_영화의_즐겨찾기_상태는_false다() throws Exception {
        mockMvc.perform(get("/favorites/550").header("Authorization", bearer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
    }

    @Test
    void 토큰_없는_평점_등록은_401이다() throws Exception {
        mockMvc.perform(post("/ratings").contentType(MediaType.APPLICATION_JSON).content(RATING))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    void 토큰이_있으면_평점이_등록되어_201이다() throws Exception {
        mockMvc.perform(post("/ratings").header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON).content(RATING))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550));
    }

    @Test
    void 공개_API와_인증_API가_OpenAPI에_구분되어_표시된다() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.components.securitySchemes.bearerAuth.scheme").value("bearer"))
                .andExpect(jsonPath("$.paths['/auth/login'].post.security").doesNotExist())
                .andExpect(jsonPath("$.paths['/members'].post.security").doesNotExist())
                .andExpect(jsonPath("$.paths['/members/{memberId}/ratings'].get.security").doesNotExist())
                .andExpect(jsonPath("$.paths['/members/me'].get.security[0].bearerAuth").isArray())
                .andExpect(jsonPath("$.paths['/favorites'].post.security[0].bearerAuth").isArray())
                .andExpect(jsonPath("$.paths['/favorites'].post.responses['409'].description")
                        .value("FAVORITE409_1 중복 등록"));
    }
}
