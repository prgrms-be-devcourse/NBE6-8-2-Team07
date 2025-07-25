package com.back.fairytale.domain.fairytale.controller;

import com.back.fairytale.domain.fairytale.dto.FairytaleCreateRequest;
import com.back.fairytale.domain.fairytale.dto.FairytaleResponse;
import com.back.fairytale.domain.fairytale.exception.UserNotFoundException;
import com.back.fairytale.domain.fairytale.service.FairytaleService;
import com.back.fairytale.global.security.CustomOAuth2User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fairytales")
@RequiredArgsConstructor
public class FairytaleController {

    private final FairytaleService fairytaleService;

    @PostMapping
    public ResponseEntity<?> createFairytale(
            @Valid @RequestBody FairytaleCreateRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        try {
            // 원래 코드 -> CustomOAuth2User에서 기본키 id 추출
            //Long userId = customOAuth2User.getId();

            //test 용도 데이터
            Long userId = (customOAuth2User != null) ? customOAuth2User.getId() : 1L;

            FairytaleResponse response = fairytaleService.createFairytale(request, userId);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
