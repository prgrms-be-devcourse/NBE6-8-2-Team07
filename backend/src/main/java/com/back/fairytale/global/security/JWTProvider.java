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

    public String extractRefreshToken(Cookie[] cookies) {
        return Arrays.stream(cookies)
                .filter(cookie -> REFRESH_TOKEN_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    public String createAccessToken(Long userId, String role) {
        return jwtUtil.createJwt(userId, role, ACCESS_TOKEN_EXPIRATION_MS, ACCESS_TOKEN_NAME);
    }

    public String createRefreshToken(Long userId, String role) {
        return jwtUtil.createJwt(userId, role, REFRESH_TOKEN_EXPIRATION_MS, REFRESH_TOKEN_NAME);
    }

    public Long getUserIdFromRefreshToken(String refreshToken) {
        validateRefreshToken(refreshToken);
        return jwtUtil.getUserId(refreshToken);
    }

    public Long getUserIdFromAccessToken(String accessToken) {
        validateAccessToken(accessToken);
        return jwtUtil.getUserId(accessToken);
    }

    public boolean validateAccessToken(String accessToken) {
        if (accessToken == null) {
            return false;
        }
        return jwtUtil.validateToken(accessToken) && "Authorization".equals(jwtUtil.getCategory(accessToken));
    }

    public boolean validateRefreshToken(String refreshToken) {
        if (refreshToken == null) {
            return false;
        }
        return jwtUtil.validateToken(refreshToken) && "refresh".equals(jwtUtil.getCategory(refreshToken));
    }

    public Cookie createCookie(String token, String name, int maxAge) {
        Cookie cookie = new Cookie(name, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
//        cookie.setSecure(true);
        cookie.setMaxAge(maxAge);
        return cookie;
    }
}
