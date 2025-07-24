package com.back.fairytale.global.security;

import jakarta.servlet.ServletException;
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

        String token = jwtUtil.createJwt(userId, role, 10 * 60 * 1000L); // 유효기간 10분
        response.sendRedirect("http://localhost:3000/");
    }
}
