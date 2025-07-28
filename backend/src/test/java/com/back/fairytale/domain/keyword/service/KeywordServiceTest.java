package com.back.fairytale.domain.keyword.service;

import com.back.fairytale.domain.keyword.entity.Keyword;
import com.back.fairytale.domain.keyword.enums.KeywordType;
import com.back.fairytale.domain.keyword.repository.KeywordRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ActiveProfiles("test")
@SpringBootTest
@Transactional
public class KeywordServiceTest {

    @Autowired
    private KeywordService keywordService;

    @Autowired
    private KeywordRepository keywordRepository;

    @Test
    @DisplayName("키워드 삭제 - 성공")
    void deleteKeyword_Success() {
        // 준비
        Keyword keyword = keywordRepository.save(
                Keyword.builder()
                        .keyword("삭제할 키워드")
                        .keywordType(KeywordType.CHILD_NAME)
                        .usageCount(0)
                        .build()
        );

        // 실행
        keywordService.deleteKeyword(keyword.getKeywordId());

        // 검증
        assertThat(keywordRepository.existsById(keyword.getKeywordId())).isFalse();
        System.out.println("키워드 삭제 성공");
    }

    @Test
    @DisplayName("존재하지 않는 키워드 삭제 - 실패")
    void deleteKeyword_NotFound() {
        Long nonExistentId = 999L;

        // 실행 & 검증
        assertThatThrownBy(() -> keywordService.deleteKeyword(nonExistentId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("키워드가 존재하지 않습니다.");

        System.out.println("존재하지 않는 키워드 삭제 실패 - 예상된 결과");
    }
}