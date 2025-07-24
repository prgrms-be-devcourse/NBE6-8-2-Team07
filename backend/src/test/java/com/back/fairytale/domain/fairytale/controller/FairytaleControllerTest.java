package com.back.fairytale.domain.fairytale.controller;

import com.back.fairytale.domain.fairytale.dto.FairytaleCreateRequest;
import com.back.fairytale.domain.fairytale.dto.FairytaleResponse;
import com.back.fairytale.domain.fairytale.repository.FairytaleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
public class FairytaleControllerTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private FairytaleRepository fairytaleRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Gemini API를 통한 동화 생성 - 실제 API 호출")
    void createFairytale_WithRealGeminiAPI() {
        FairytaleCreateRequest request = new FairytaleCreateRequest(
                "지민",
                "용감한 기사",
                "공주, 마법사",
                "마법의 성",
                "용기와 친구의 소중함",
                "모험적이고 따뜻한",
                1L
        );

        ResponseEntity<FairytaleResponse> response = restTemplate.postForEntity(
                "/api/fairytales",
                request,
                FairytaleResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();

        FairytaleResponse fairytaleResponse = response.getBody();
        assertThat(fairytaleResponse.id()).isNotNull();
        assertThat(fairytaleResponse.title()).isNotEmpty();
        assertThat(fairytaleResponse.content()).isNotEmpty();
        assertThat(fairytaleResponse.childName()).isEqualTo("지민");
        assertThat(fairytaleResponse.childRole()).isEqualTo("용감한 기사");
        assertThat(fairytaleResponse.characters()).isEqualTo("공주, 마법사");
        assertThat(fairytaleResponse.place()).isEqualTo("마법의 성");
        assertThat(fairytaleResponse.lesson()).isEqualTo("용기와 친구의 소중함");
        assertThat(fairytaleResponse.mood()).isEqualTo("모험적이고 따뜻한");
        assertThat(fairytaleResponse.userId()).isEqualTo(1L);
        assertThat(fairytaleResponse.createdAt()).isNotNull();

        // DB 저장 확인
        var savedFairytales = fairytaleRepository.findAll();
        assertThat(savedFairytales).hasSize(1);
        assertThat(savedFairytales.get(0).getTitle()).isEqualTo(fairytaleResponse.title());

        // 생성된 동화 내용 출력 (확인용)
        System.out.println("=== 생성된 동화 ===");
        System.out.println("제목: " + fairytaleResponse.title());
        System.out.println("내용: " + fairytaleResponse.content());
        System.out.println("==================");
    }
}
