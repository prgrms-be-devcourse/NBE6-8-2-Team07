package com.back.fairytale.domain.user.controller;

import com.back.fairytale.domain.user.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final AuthService authService;

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        try {
            String refreshToken = authService.getRefreshTokenFromCookies(request.getCookies());

            String newAccessToken = authService.reissueAccessToken(refreshToken);
            String newRefreshToken = authService.reissueRefreshToken(refreshToken);

            response.addCookie(authService.createAccessTokenCookie(newAccessToken));
            response.addCookie(authService.createRefreshTokenCookie(newRefreshToken));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.warn("Refresh token invalid: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}