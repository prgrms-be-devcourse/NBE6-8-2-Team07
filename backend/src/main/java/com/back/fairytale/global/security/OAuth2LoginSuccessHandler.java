package com.back.fairytale.global.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@RequiredArgsConstructor
@Component
@Slf4j
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JWTProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        log.info("OAuth2 로그인 성공: {}", authentication.getName());
        CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();

        Long userId = customUser.getId();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        Cookie accessCookie = jwtProvider.createAccessTokenCookie(userId, role);
        Cookie refreshCookie = jwtProvider.createRefreshTokenCookie(userId, role);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
        response.sendRedirect("http://localhost:3000/");
    }
}
