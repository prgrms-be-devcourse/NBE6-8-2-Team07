package com.back.fairytale.domain.fairytale.controller;

import com.back.fairytale.domain.fairytale.dto.FairytaleCreateRequest;
import com.back.fairytale.domain.fairytale.dto.FairytaleDetailResponse;
import com.back.fairytale.domain.fairytale.dto.FairytaleListResponse;
import com.back.fairytale.domain.fairytale.dto.FairytaleResponse;
import com.back.fairytale.domain.fairytale.exception.FairytaleNotFoundException;
import com.back.fairytale.domain.fairytale.exception.UserNotFoundException;
import com.back.fairytale.domain.fairytale.service.FairytaleService;
import com.back.fairytale.global.security.CustomOAuth2User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fairytales")
@RequiredArgsConstructor
public class FairytaleController {

    private final FairytaleService fairytaleService;

    // 동화 생성
    @PostMapping
    public ResponseEntity<?> createFairytale(
            @Valid @RequestBody FairytaleCreateRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        try {
            // 원래 코드 -> CustomOAuth2User에서 기본키 id 추출
            //Long userId = customOAuth2User.getId();

            // test 용도 데이터
            Long userId = (customOAuth2User != null) ? customOAuth2User.getId() : 1L;

            FairytaleResponse response = fairytaleService.createFairytale(request, userId);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 동화 전체 조회
    @GetMapping
    public ResponseEntity<?> getAllFairytales(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        try {
            //Long userId = customOAuth2User.getId();

            // test 용도 데이터
            Long userId = (customOAuth2User != null) ? customOAuth2User.getId() : 1L;

            List<FairytaleListResponse> response = fairytaleService.getAllFairytalesByUserId(userId);
            return ResponseEntity.ok(response);
        } catch (FairytaleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 동화 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getFairytaleById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        try {
            //Long userId = customOAuth2User.getId();

            // test 용도 데이터
            Long userId = (customOAuth2User != null) ? customOAuth2User.getId() : 1L;

            FairytaleDetailResponse response = fairytaleService.getFairytaleByIdAndUserId(id, userId);
            return ResponseEntity.ok(response);
        } catch (FairytaleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 동화 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFairytale(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        try {
            //Long userId = customOAuth2User.getId();

            // test 용도 데이터
            Long userId = (customOAuth2User != null) ? customOAuth2User.getId() : 1L;

            fairytaleService.deleteFairytaleByIdAndUserId(id, userId);
            return ResponseEntity.noContent().build();
        } catch (FairytaleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
