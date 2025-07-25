package com.back.fairytale.domain.keyword.service;

import com.back.fairytale.domain.keyword.dto.KeywordResponseDto;
import com.back.fairytale.domain.keyword.enums.KeywordType;
import com.back.fairytale.domain.keyword.repository.KeywordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KeywordService {

    private final KeywordRepository keywordRepository;

    // 모든 키워드 조회
    @Transactional(readOnly = true)
    public List<KeywordResponseDto> getAllKeywords() {
        return keywordRepository.findAll().stream()
                .map(KeywordResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
    // 타입별 키워드 조회 (Enum 타입으로 받음)
    @Transactional(readOnly = true)
    public List<KeywordResponseDto> getKeywordsByType(KeywordType keywordType) {
        return keywordRepository.findByKeywordType(keywordType).stream()
                .map(KeywordResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}