package com.back.fairytale.global.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 로그인 성공: {}", authentication.getName());
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        //fixme jwt 생성할 때 pk를 사용해도 되는지 확인 필요
        Long userId = customOAuth2User.getId();

        String role = authentication.getAuthorities().iterator().next().getAuthority();
        log.info("OAuth2 Role {}", role);

        String accessToken = jwtUtil.createJwt(userId, role, 10 * 60 * 1000L, "access"); // 유효기간 10분
        String refreshToken = jwtUtil.createJwt(userId, role, 24 * 60 * 60 * 1000L, "refresh"); // 유효기간 24시간
        response.addCookie(createCookie(accessToken, "Authorization", 10 * 60));
        response.addCookie(createCookie(refreshToken, "refresh", 24 * 60 * 60));
        response.sendRedirect("http://localhost:3000/");
    }

    private Cookie createCookie(String token, String key, int expiry) {
        Cookie cookie = new Cookie(key, token);
        cookie.setMaxAge(expiry);
//        cookie.setSecure(true); // HTTPS 환경에서만 쿠키 전송
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        return cookie;
    }
}
