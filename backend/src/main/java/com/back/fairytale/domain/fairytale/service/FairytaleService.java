package com.back.fairytale.domain.fairytale.service;

import com.back.fairytale.domain.fairytale.dto.FairytaleCreateRequest;
import com.back.fairytale.domain.fairytale.dto.FairytaleResponse;
import com.back.fairytale.domain.fairytale.entity.Fairytale;
import com.back.fairytale.domain.fairytale.repository.FairytaleRepository;
import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.external.ai.client.GeminiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FairytaleService {

    private final FairytaleRepository fairytaleRepository;
    private final GeminiClient geminiClient;

    public FairytaleResponse createFairytale(FairytaleCreateRequest request) {
        // 프롬프트 생성
        String prompt = buildPrompt(request);

        // Gemini API 호출
        String generatedContent = geminiClient.generateFairytale(prompt);

        // 제목과 내용 분리
        String[] titleAndContent = extractTitleAndContent(generatedContent);
        String title = titleAndContent[0];
        String content = titleAndContent[1];

        // User 엔티티 조회 (또는 임시로 User 객체 생성)
        // 실제로는 UserRepository에서 조회
        // Authentication authentication User user = (User) authentication.getPrincipal(); String userId = user.getUserId(); 이렇게 할 계획
        User user = User.builder()
                .id(request.userId())
                .build(); // 임시 User 객체 생성

        // 동화 저장
        Fairytale fairytale = Fairytale.builder()
                .user(user) // userId 대신 User 객체 전달
                .title(title)
                .content(content)
                .childName(request.childName())
                .childRole(request.childRole())
                .characters(request.characters())
                .place(request.place())
                .lesson(request.lesson())
                .mood(request.mood())
                .build();

        Fairytale savedFairytale = fairytaleRepository.save(fairytale);

        log.info("동화 생성 완료 - ID: {}, 제목: {}", savedFairytale.getId(), title);

        return FairytaleResponse.from(savedFairytale);
    }

    private String buildPrompt(FairytaleCreateRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("어린이를 위한 동화를 만들어주세요.\n");
        prompt.append("응답 형식: [제목: 동화제목] 다음 줄부터 동화 내용\n\n");
        prompt.append("조건:\n");
        prompt.append("- 아이 이름: ").append(request.childName()).append("\n");
        prompt.append("- 아이 역할: ").append(request.childRole()).append("\n");

        if (request.characters() != null && !request.characters().trim().isEmpty()) {
            prompt.append("- 등장인물: ").append(request.characters()).append("\n");
        }
        if (request.place() != null && !request.place().trim().isEmpty()) {
            prompt.append("- 장소: ").append(request.place()).append("\n");
        }
        if (request.lesson() != null && !request.lesson().trim().isEmpty()) {
            prompt.append("- 교훈: ").append(request.lesson()).append("\n");
        }
        if (request.mood() != null && !request.mood().trim().isEmpty()) {
            prompt.append("- 분위기: ").append(request.mood()).append("\n");
        }

        prompt.append("\n").append(request.childName()).append("이(가) ").append(request.childRole()).append(" 역할로 나오는 ");
        prompt.append("800-1200자 정도의 완성된 동화를 만들어주세요.");

        return prompt.toString();
    }

    private String[] extractTitleAndContent(String generatedContent) {
        String title = "제목 없음";
        String content = generatedContent;

        if (generatedContent.contains("[제목:") && generatedContent.contains("]")) {
            int titleStart = generatedContent.indexOf("[제목:") + 4;
            int titleEnd = generatedContent.indexOf("]", titleStart);
            if (titleEnd > titleStart) {
                title = generatedContent.substring(titleStart, titleEnd).trim();
                content = generatedContent.substring(titleEnd + 1).trim();
            }
        }

        return new String[]{title, content};
    }
}
