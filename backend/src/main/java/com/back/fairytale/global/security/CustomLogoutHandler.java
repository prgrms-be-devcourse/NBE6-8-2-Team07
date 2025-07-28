package com.back.fairytale.global.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@Slf4j
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {
    private final LogoutService logoutService; // 인터페이스 의존
    private final JWTProvider jwtProvider;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        try {
            String accessToken = extractAccessTokenFromCookies(request.getCookies());

            if (accessToken != null && jwtProvider.validateAccessToken(accessToken)) {
                Long userId = jwtProvider.getUserIdFromAccessToken(accessToken);
                logoutService.logout(userId);
            }

        } catch (Exception e) {
            log.warn("Logout failed: {}", e.getMessage());
        } finally {
            response.addCookie(jwtProvider.createCookie(null, "Authorization", 0));
            response.addCookie(jwtProvider.createCookie("null", "refresh", 0));
        }
    }

    private String extractAccessTokenFromCookies(Cookie[] cookies) {
        return Arrays.stream(cookies)
                .filter(cookie -> "Authorization".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }


}
