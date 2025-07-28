package com.back.fairytale.domain.keyword.entity;

import com.back.fairytale.domain.keyword.enums.KeywordType;
import com.back.fairytale.domain.user.entity.User;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String keyword;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private KeywordType keywordType;

    @Column(name = "usage_count", nullable = false)
    private int usageCount;

    // 동시성 제어를 위한 버전 필드 추가
    @Version
    private Long version;

    // usageCount 증가 메서드
    public void incrementUsageCount() {
        this.usageCount++;
    }

    public static Keyword of(String keyword, KeywordType keywordType) {
        return Keyword.builder()
                .keyword(keyword.trim())
                .keywordType(keywordType)
                .build();
    }
}