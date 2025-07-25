package com.back.fairytale.domain.fairytale.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc(addFilters = false)
@Transactional
public class FairytaleControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Gemini API를 통한 동화 생성 - 실제 API 호출")
    void t1() throws Exception {
        String requestJson = """
            {
                "childName": "지민",
                "childRole": "용감한 기사",
                "characters": "공주, 마법사",
                "place": "마법의 성",
                "lesson": "용기",
                "mood": "모험적인"
            }
            """;

        mockMvc.perform(post("/fairytales")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk());

        System.out.println("동화 생성 성공");
    }
}
