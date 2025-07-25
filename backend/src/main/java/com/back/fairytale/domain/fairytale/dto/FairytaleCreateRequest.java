package com.back.fairytale.domain.fairytale.dto;

import jakarta.validation.constraints.NotBlank;

public record FairytaleCreateRequest(
    @NotBlank(message = "아이 이름은 필수입니다")
    String childName,

    @NotBlank(message = "아이 역할은 필수입니다")
    String childRole,

    @NotBlank(message = "등장인물은 필수입니다")
    String characters,

    @NotBlank(message = "장소는 필수입니다")
    String place,

    @NotBlank(message = "교훈은 필수입니다")
    String lesson,

    @NotBlank(message = "분위기는 필수입니다")
    String mood
) {}
