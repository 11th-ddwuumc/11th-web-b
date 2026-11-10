package com.umc.study;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class Week7AuthApiTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @Test
    void requiredAuthenticationAndAuthorizationScenario() throws Exception {
        signUp("a@umc.com", "회원A", "Password1!");
        signUp("b@umc.com", "회원B", "Password1!");

        String tokenA = login("a@umc.com", "Password1!");
        String tokenB = login("b@umc.com", "Password1!");

        mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"missing@umc.com\",\"password\":\"Password1!\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_1"))
                .andExpect(jsonPath("$.message").value("이메일 또는 비밀번호가 올바르지 않습니다."));
        mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"a@umc.com\",\"password\":\"WrongPassword1!\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_1"))
                .andExpect(jsonPath("$.message").value("이메일 또는 비밀번호가 올바르지 않습니다."));

        mockMvc.perform(get("/members/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));

        String tamperedToken = tokenA.substring(0, tokenA.length() - 1)
                + (tokenA.endsWith("a") ? "b" : "a");
        mockMvc.perform(get("/members/me").header("Authorization", "Bearer " + tamperedToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_3"));

        mockMvc.perform(options("/members/me")
                        .header("Origin", "http://127.0.0.1:5173")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "authorization"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/members/me").header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.email").value("a@umc.com"));

        MvcResult created = mockMvc.perform(post("/ratings")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":101,\"score\":5,\"comment\":\"최고예요\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(101))
                .andReturn();
        long ratingId = json(created).path("result").path("ratingId").asLong();

        mockMvc.perform(patch("/ratings/{ratingId}", ratingId)
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"score\":1,\"comment\":\"바꾸기\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("RATING403_1"));

        mockMvc.perform(delete("/ratings/{ratingId}", ratingId)
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"));
    }

    private void signUp(String email, String nickname, String password) throws Exception {
        mockMvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SignupBody(email, nickname, password))))
                .andExpect(status().isCreated());
    }

    private String login(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginBody(email, password))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.accessToken").isNotEmpty())
                .andReturn();
        return json(result).path("result").path("accessToken").asText();
    }

    private JsonNode json(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsByteArray());
    }

    private record SignupBody(String email, String nickname, String password) {}
    private record LoginBody(String email, String password) {}
}
