package com.back.fairytale.domain.fairytale.dto;

import com.back.fairytale.domain.fairytale.entity.Fairytale;

import java.time.LocalDate;

public record FairytaleListResponse(
        Long id,
        String title,
        LocalDate createdAt
) {
    public static FairytaleListResponse from(Fairytale fairytale) {
        return new FairytaleListResponse(
                fairytale.getId(),
                fairytale.getTitle(),
                fairytale.getCreatedAt().toLocalDate()
        );
    }
}
