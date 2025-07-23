package com.back.fairytale.domain.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class FavoriteController {

    // 더미 데이터 (데이터가 없는 관계로....)
    private final List<Long> favorites = new ArrayList<>(List.of(1L, 2L, 3L));

    @GetMapping("/favorites")
    public ResponseEntity<List<Long>> getFavorites() {
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/post/{storyId}/favorite")
    public ResponseEntity<String> addFavorite(@PathVariable Long postId) {
        if (postId != null && !favorites.contains(postId)) {
            favorites.add(postId);
            return ResponseEntity.status(HttpStatus.CREATED).body("게시물 " + postId +  "즐겨찾기에 추가되었습니다.");
        }
        if (favorites.contains(postId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 즐겨찾기에 추가된 게시물입니다.");
        }
        return ResponseEntity.badRequest().body("이상한 요청");
    }

    @DeleteMapping("/post/{storyId}/favorite")
    public ResponseEntity<String> removeFavorite(@PathVariable Long postId) {
        if (favorites.remove(postId)) {
            return ResponseEntity.ok("게시물 " + postId + "즐겨찾기에서 해제되었습니다.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("즐겨찾기에서 해당 게시물을 찾을 수 없습니다.");
    }

}