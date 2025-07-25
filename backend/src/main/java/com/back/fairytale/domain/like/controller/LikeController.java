package com.back.fairytale.domain.like.controller;

import com.back.fairytale.domain.like.dto.LikeDto;
import com.back.fairytale.domain.like.service.LikeService;
import com.back.fairytale.global.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @GetMapping("/likes")
    public ResponseEntity<List<LikeDto>> getLikes(@AuthenticationPrincipal CustomOAuth2User user) {
        List<LikeDto> likes = likeService.getLikes(user);
        return ResponseEntity.ok(likes);
    }

    @PostMapping("/{fairytaleId}/like")
    public ResponseEntity<String> addLike(@AuthenticationPrincipal CustomOAuth2User user, Long fairytaleId) {
        LikeDto likeDto = LikeDto.builder()
                .userId(user.getId())
                .fairytaleId(fairytaleId)
                .build();
        try {
            likeService.addLike(likeDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return ResponseEntity.ok("게시물 " + fairytaleId + " 좋아요가 추가되었습니다.");
    }

    @DeleteMapping("/{fairytaleId}/like")
    public ResponseEntity<String> removeLike(@AuthenticationPrincipal CustomOAuth2User user, Long fairytaleId) {
        LikeDto likeDto = LikeDto.builder()
                .userId(user.getId())
                .fairytaleId(fairytaleId)
                .build();
        try {
            likeService.removeLike(likeDto);
            return ResponseEntity.ok("게시물 " + fairytaleId + " 좋아요가 해제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}