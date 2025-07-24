package com.back.fairytale.external.ai.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

// Gemini에게 보낼 메시지를 JSON 형식으로 만들기 위한 틀로 볼 수 있음
@Getter
@Builder
public class AIRequest {
    private List<Content> contents;

    @Getter
    @Builder
    public static class Content {
        private List<Part> parts;
    }

    @Getter
    @Builder
    public static class Part {
        private String text;
    }

    public static AIRequest of(String prompt) {
        return AIRequest.builder()
                .contents(List.of(
                        Content.builder()
                            .parts(List.of(
                                Part.builder()
                                    .text(prompt)
                                    .build()
                            ))
                        .build()
                ))
                .build();
    }
}
