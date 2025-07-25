package com.back.fairytale.domain.fairytale.dto;

import jakarta.validation.constraints.NotBlank;

public record FairytaleCreateRequest(
    @NotBlank(message = "아이 이름은 필수입니다")
    String childName,

    @NotBlank(message = "아이 역할은 필수입니다")
    String childRole,

    String characters,
    String place,
    String lesson,
    String mood
) {}
