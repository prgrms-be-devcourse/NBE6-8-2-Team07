package com.back.fairytale.domain.keyword.entity;

import com.back.fairytale.domain.keyword.enums.KeywordType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "keyword")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Keyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "keyword_id")
    private Long keywordId;

    @Column(nullable = false, length = 50)
    private String keyword;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private KeywordType keywordType;

    @Column(name = "usage_count", nullable = false)
    private int usageCount;

    public static Keyword of(String keyword, KeywordType keywordType) {
        return Keyword.builder()
                .keyword(keyword.trim())
                .keywordType(keywordType)
                .build();
    }
}