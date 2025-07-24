package com.back.fairytale.domain.keyword.dto;

import com.back.fairytale.domain.keyword.enums.KeywordType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class KeywordResponseDto {
    private Long keywordId;
    private String keyword;
    private KeywordType keywordType;
    private int count;
}
