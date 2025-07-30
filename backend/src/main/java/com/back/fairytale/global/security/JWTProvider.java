package com.back.fairytale.global.security;

import jakarta.servlet.http.Cookie;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;


@Component
@RequiredArgsConstructor
public class JWTProvider {

    private final JWTUtil jwtUtil;

    @Value("${spring.cookie.secure}")
    private boolean cookieSecure;

    @Value("${spring.cookie.same-site}")
    private String cookieSameSite;

    @Getter
    public enum TokenType {
        ACCESS("Authorization", 10 * 60 * 1000L, 600),
        REFRESH("refresh", 24 * 60 * 60 * 1000L, 86400);

        private final String name;
        private final Long expirationMs;
        private final int cookieMaxAge;

        TokenType(String name, Long expirationMs, int cookieMaxAge) {
            this.name = name;
            this.expirationMs = expirationMs;
            this.cookieMaxAge = cookieMaxAge;
        }
    }

    public Cookie createRefreshTokenCookie(String refreshToken) {
        return createCookie(refreshToken, TokenType.REFRESH.getName(), TokenType.REFRESH.getCookieMaxAge());
    }

    public String createAccessToken(Long userId, String role) {
        return createToken(userId, role, TokenType.ACCESS);
    }

    public String createRefreshToken(Long userId, String role) {
        return createToken(userId, role, TokenType.REFRESH);
    }

    public Cookie wrapTokenToCookie(String token, TokenType tokenType) {
        return createCookie(token, tokenType.getName(), tokenType.getCookieMaxAge());
    }

    public Cookie wrapAccessTokenToCookie(String token) {
        return wrapTokenToCookie(token, TokenType.ACCESS);
    }

    public Cookie wrapRefreshTokenToCookie(String token) {
        return wrapTokenToCookie(token, TokenType.REFRESH);
    }

    public String extractTokenFromCookies(Cookie[] cookies, TokenType tokenType) {
        if (cookies == null) return null;
        return Arrays.stream(cookies)
                .filter(cookie -> tokenType.getName().equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    public String extractRefreshToken(Cookie[] cookies) {
        return extractTokenFromCookies(cookies, TokenType.REFRESH);
    }

    public boolean validateAccessToken(String accessToken) {
        return validateToken(accessToken, TokenType.ACCESS);
    }

    public boolean validateRefreshToken(String refreshToken) {
        return validateToken(refreshToken, TokenType.REFRESH);
    }

    public Long getUserIdFromAccessToken(String accessToken) {
        return getUserIdFromToken(accessToken, TokenType.ACCESS);
    }

    public Long getUserIdFromRefreshToken(String refreshToken) {
        return getUserIdFromToken(refreshToken, TokenType.REFRESH);
    }

    public Cookie createCookie(String token, String name, int maxAge) {
        Cookie cookie = new Cookie(name, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setSecure(cookieSecure);
        cookie.setAttribute("SameSite", cookieSameSite);
        cookie.setMaxAge(maxAge);
        return cookie;
    }

    private boolean validateToken(String token, TokenType tokenType) {
        if (token == null) {
            return false;
        }
        return jwtUtil.validateToken(token) && tokenType.getName().equals(jwtUtil.getCategory(token));
    }

    private Long getUserIdFromToken(String token, TokenType tokenType) {
        if (!validateToken(token, tokenType)) {
            throw new IllegalArgumentException("Invalid " + tokenType.getName() + " token");
        }
        return jwtUtil.getUserId(token);
    }

    private Cookie createTokenCookie(Long userId, String role, TokenType tokenType) {
        String token = createToken(userId, role, tokenType);
        return createCookie(token, tokenType.getName(), tokenType.getCookieMaxAge());
    }

    private String createToken(Long userId, String role, TokenType tokenType) {
        return jwtUtil.createJwt(userId, role, tokenType.getExpirationMs(), tokenType.getName());
    }
}