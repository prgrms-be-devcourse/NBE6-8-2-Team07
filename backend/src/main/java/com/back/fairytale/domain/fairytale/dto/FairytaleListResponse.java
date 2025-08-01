package com.back.fairytale.domain.fairytale.dto;

import com.back.fairytale.domain.fairytale.entity.Fairytale;

import java.time.LocalDateTime;

public record FairytaleListResponse(
        Long id,
        String title,
        String imageUrl,
        String childName,
        String childRole,
        String characters,
        String place,
        String mood,
        String lesson,
        LocalDateTime createdAt
) {
    public static FairytaleListResponse from(Fairytale fairytale) {
        return new FairytaleListResponse(
                fairytale.getId(),
                fairytale.getTitle(),
                fairytale.getImageUrl(),
                fairytale.getChildName(),
                fairytale.getChildRole(),
                fairytale.getCharacters(),
                fairytale.getPlace(),
                fairytale.getMood(),
                fairytale.getLesson(),
                fairytale.getCreatedAt()
        );
    }
}

