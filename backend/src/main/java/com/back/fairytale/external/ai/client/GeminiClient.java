package com.back.fairytale.external.ai.client;

import com.back.fairytale.external.ai.dto.GeminiRequest;
import com.back.fairytale.external.ai.dto.GeminiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
@Slf4j // 로그
public class GeminiClient {

    private final RestTemplate restTemplate;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateFairytale(String prompt) {
        try {
            GeminiRequest request = GeminiRequest.of(prompt);

            // 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String urlWithKey = apiUrl + "?key=" + apiKey;

            HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers); // 요청 데이터 + 헤더

            log.info("Gemini API 호출: {}", prompt);

            // API 호출
            ResponseEntity<GeminiResponse> response = restTemplate.postForEntity(
                    urlWithKey,
                    entity,
                    GeminiResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String generatedText = response.getBody().getGeneratedText();
                log.info("Gemini API 응답 성공");
                return generatedText;
            } else {
                log.error("Gemini API 응답 실패: {}", response.getStatusCode());
                throw new RuntimeException("Gemini API 호출 실패");
            }

        } catch (Exception e) {
            log.error("Gemini API 호출 중 오류 발생", e);
            throw new RuntimeException("Gemini API 연결 실패: " + e.getMessage());
        }
    }
}
