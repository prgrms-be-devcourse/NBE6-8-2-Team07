package com.back.fairytale.domain.fairytale.dto;

import com.back.fairytale.domain.fairytale.entity.Fairytale;

import java.time.LocalDateTime;

public record FairytaleListResponse(
    Long id,
    String title,
    LocalDateTime createdAt
) {
    public static FairytaleListResponse from(Fairytale fairytale) {
        return new FairytaleListResponse(
                fairytale.getId(),
                fairytale.getTitle(),
                fairytale.getCreatedAt()
        );
    }
}
