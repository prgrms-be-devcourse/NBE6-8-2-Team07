package com.back.fairytale.global.security;

import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JWTProvider {

    private final JWTUtil jwtUtil;

    private static final Long ACCESS_TOKEN_EXPIRATION_MS = 10 * 60 * 1000L;
    private static final Long REFRESH_TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000L;

    private static final int ACCESS_TOKEN_COOKIE_MAX_AGE = 600;
    private static final int REFRESH_TOKEN_COOKIE_MAX_AGE = 86400;

    private static final String ACCESS_TOKEN_NAME = "Authorization";
    private static final String REFRESH_TOKEN_NAME = "refresh";

    public Cookie createAccessTokenCookie(Long userId, String role) {
        String token = jwtUtil.createJwt(userId, role, ACCESS_TOKEN_EXPIRATION_MS, ACCESS_TOKEN_NAME);
        return createCookie(token, ACCESS_TOKEN_NAME, ACCESS_TOKEN_COOKIE_MAX_AGE);
    }

    public Cookie createRefreshTokenCookie(Long userId, String role) {
        String token = jwtUtil.createJwt(userId, role, REFRESH_TOKEN_EXPIRATION_MS, REFRESH_TOKEN_NAME);
        return createCookie(token, REFRESH_TOKEN_NAME, REFRESH_TOKEN_COOKIE_MAX_AGE);
    }

    public Cookie wrapAccessTokenToCookie(String token) {
        return createCookie(token, ACCESS_TOKEN_NAME, ACCESS_TOKEN_COOKIE_MAX_AGE);
    }

    public Cookie wrapRefreshTokenToCookie(String token) {
        return createCookie(token, REFRESH_TOKEN_NAME, REFRESH_TOKEN_COOKIE_MAX_AGE);
    }

    public String reissueAccessToken(String refreshToken) {
        validateRefreshToken(refreshToken);
        Long userId = jwtUtil.getUserId(refreshToken);
        String role = jwtUtil.getRole(refreshToken);
        return jwtUtil.createJwt(userId, role, ACCESS_TOKEN_EXPIRATION_MS, ACCESS_TOKEN_NAME);
    }

    public String reissueRefreshToken(String refreshToken) {
        validateRefreshToken(refreshToken);
        Long userId = jwtUtil.getUserId(refreshToken);
        String role = jwtUtil.getRole(refreshToken);
        return jwtUtil.createJwt(userId, role, REFRESH_TOKEN_EXPIRATION_MS, REFRESH_TOKEN_NAME);
    }

    public String extractRefreshToken(Cookie[] cookies) {
        return Arrays.stream(cookies)
                .filter(cookie -> REFRESH_TOKEN_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private void validateRefreshToken(String refreshToken) {
        if (refreshToken == null) {
            throw new IllegalArgumentException("refresh token이 존재하지 않습니다.");
        }
        if (!jwtUtil.validateToken(refreshToken) || !"refresh".equals(jwtUtil.getCategory(refreshToken))) {
            throw new IllegalArgumentException("refresh token이 유효하지 않습니다.");
        }
    }

    private Cookie createCookie(String token, String name, int maxAge) {
        Cookie cookie = new Cookie(name, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
//        cookie.setSecure(true);
        cookie.setMaxAge(maxAge);
        return cookie;
    }
}
