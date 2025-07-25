package com.back.fairytale.domain.fairytale.service;

import com.back.fairytale.domain.fairytale.dto.FairytaleCreateRequest;
import com.back.fairytale.domain.fairytale.dto.FairytaleResponse;
import com.back.fairytale.domain.fairytale.entity.Fairytale;
import com.back.fairytale.domain.fairytale.repository.FairytaleRepository;
import com.back.fairytale.domain.keyword.entity.Keyword;
import com.back.fairytale.domain.keyword.enums.KeywordType;
import com.back.fairytale.domain.keyword.repository.KeywordRepository;
import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.enums.IsDeleted;
import com.back.fairytale.domain.user.enums.Role;
import com.back.fairytale.domain.user.repository.UserRepository;
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
    private final KeywordRepository keywordRepository;
    private final UserRepository userRepository;
    private final GeminiClient geminiClient;

    public FairytaleResponse createFairytale(FairytaleCreateRequest request, Long userId) {
        // 프롬프트 생성
        String prompt = buildPrompt(request);

        // Gemini API 호출
        String generatedContent = geminiClient.generateFairytale(prompt);

        // 제목과 내용 분리
        String[] titleAndContent = extractTitleAndContent(generatedContent);
        String title = titleAndContent[0];
        String content = titleAndContent[1];

        // 원래코드
        //User user = userRepository.findById(userId)
        //        .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다. ID: " + userId));

        // test 용도 데이터
        User user = userRepository.findById(userId)
                .orElseGet(() -> {
                    // 없으면 테스트용 User 생성
                    User newUser = User.builder()
                            .socialId("test_" + userId)
                            .name("테스트사용자")
                            .nickname("테스트")
                            .email("test@test.com")
                            .role(Role.USER)
                            .isDeleted(IsDeleted.NOT_DELETED)
                            .build();
                    return userRepository.save(newUser);
                });

        // 동화 저장
        Fairytale fairytale = Fairytale.builder()
                .user(user)
                .title(title)
                .content(content)
                .build();

        Fairytale savedFairytale = fairytaleRepository.save(fairytale);

        // 키워드 저장
        saveKeyword(savedFairytale, request.childName(), KeywordType.아이이름);
        saveKeyword(savedFairytale, request.childRole(), KeywordType.아이역할);
        saveKeywords(savedFairytale, request.characters(), KeywordType.캐릭터들);
        saveKeywords(savedFairytale, request.place(), KeywordType.장소);
        saveKeywords(savedFairytale, request.lesson(), KeywordType.교훈);
        saveKeywords(savedFairytale, request.mood(), KeywordType.분위기);

        log.info("동화 생성 완료 - ID: {}, 제목: {}, 사용자: {}", savedFairytale.getId(), title, user.getName());

        return FairytaleResponse.from(savedFairytale);
    }

    // 단일 키워드 저장
    private void saveKeyword(Fairytale fairytale, String keywordValue, KeywordType type) {
        if (keywordValue != null && !keywordValue.trim().isEmpty()) {
            Keyword keyword = keywordRepository.findByKeywordAndKeywordType(keywordValue.trim(), type)
                    .orElseGet(() -> keywordRepository.save(
                            Keyword.of(keywordValue.trim(), type)));

            fairytale.addKeyword(keyword);
        }
    }

    // 다중 키워드 저장
    private void saveKeywords(Fairytale fairytale, String input, KeywordType type) {
        if (input != null && !input.trim().isEmpty()) {
            String[] keywords = input.split(",");
            for (String keywordValue : keywords) {
                String trimmedKeyword = keywordValue.trim();
                if (!trimmedKeyword.isEmpty()) {
                    Keyword keyword = keywordRepository.findByKeywordAndKeywordType(trimmedKeyword, type)
                            .orElseGet(() -> keywordRepository.save(
                                    Keyword.of(trimmedKeyword, type)));

                    fairytale.addKeyword(keyword);
                }
            }
        }
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
        prompt.append("900-1300자 정도의 완성된 동화를 만들어주세요.");

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
