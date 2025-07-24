package com.back.fairytale.domain.keyword.dto;

import com.back.fairytale.domain.keyword.enums.KeywordType;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KeywordRequestDto {
    private String keyword;
    private KeywordType keywordType;
    private Long userId;
}
