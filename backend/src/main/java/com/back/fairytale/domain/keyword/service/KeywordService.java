package com.back.fairytale.domain.keyword.service;

import com.back.fairytale.domain.keyword.repository.KeywordRepository;
import com.back.fairytale.domain.keyword.dto.KeywordResponseDto;
import com.back.fairytale.domain.keyword.entity.Keyword;
import com.back.fairytale.domain.keyword.dto.KeywordRequestDto;
import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KeywordService {
    private final KeywordRepository keywordRepository;
    private final UserRepository userRepository;

    public List<KeywordResponseDto> getAllKeywords() {
        List<Keyword> keywords = keywordRepository.findAll();
        return keywords.stream()
                .map(k -> KeywordResponseDto.builder()
                        .keywordId(k.getKeywordId())
                        .keyword(k.getKeyword())
                        .keywordType(k.getKeywordType())
                        .count(k.getCount())
                        .build())
                .collect(Collectors.toList());
    }

    public KeywordResponseDto createKeyword(KeywordRequestDto requestDto) {
        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        Keyword keyword = Keyword.builder()
                .user(user)
                .keyword(requestDto.getKeyword())
                .keywordType(requestDto.getKeywordType())
                .count(0)
                .build();
        Keyword saved = keywordRepository.save(keyword);
        return KeywordResponseDto.builder()
                .keywordId(saved.getKeywordId())
                .keyword(saved.getKeyword())
                .keywordType(saved.getKeywordType())
                .count(saved.getCount())
                .build();
    }
}
