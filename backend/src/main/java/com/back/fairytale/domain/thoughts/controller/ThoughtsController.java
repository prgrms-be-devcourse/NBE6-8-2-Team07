package com.back.fairytale.domain.thoughts.controller;

import com.back.fairytale.global.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/thoughts")
@RequiredArgsConstructor
public class ThoughtsController {

    private final ThoughtsService thoughtsService;

// 아이생각 작성
@PostMapping
public ResponseEntity<ThoughtsResponse> createThoughts(
        @RequestBody ThoughtsRequest request,
        @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

    ThoughtsResponse response = thoughtsService.createThoughts(request, customOAuth2User.getId());

    // 새로 생성된 리소스의 URI를 생성
    URI location = URI.create("/api/thoughts/" + response.getId()); // response에 getId()가 있다고 가정

    // 201 Created 상태 코드와 Location 헤더, 응답 본문을 함께 반환
    return ResponseEntity.created(location).body(response);
}

    // 아이생각 조회
    @GetMapping("/{id}")
    public ResponseEntity<ThoughtsResponse> getThoughts(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        ThoughtsResponse response = thoughtsService.getThoughts(id, customOAuth2User.getId());

        return ResponseEntity.ok(response);
    }

    // 아이생각 수정
    @PutMapping("/{id}")
    public ResponseEntity<ThoughtsResponse> updateThoughts(
            @PathVariable Long id,
            @RequestBody ThoughtsUpdateRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        ThoughtsResponse response = thoughtsService.updateThoughts(id, request, customOAuth2User.getId());
        return ResponseEntity.ok(response);
    }

    // 아이생각 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThoughts(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        thoughtsService.deleteThoughts(id, customOAuth2User.getId());
        return ResponseEntity.noContent().build();
    }
}
