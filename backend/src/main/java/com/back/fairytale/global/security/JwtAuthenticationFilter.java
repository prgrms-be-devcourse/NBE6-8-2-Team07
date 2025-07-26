package com.back.fairytale.global.security;

import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = getAccessTokenFromCookies(request);

        if (accessToken == null) {
            log.info("요청에 JWT 토큰이 없습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        if (!jwtUtil.validateToken(accessToken)) {
            log.info("JWT 토큰이 유효하지 않습니다.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Long id = jwtUtil.getUserId(accessToken);
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            log.warn("사용자를 찾을 수 없습니다. ID: {}", id);
            filterChain.doFilter(request, response);
            return;
        }
        User user = optionalUser.get();

        CustomOAuth2User customOAuth2User = new CustomOAuth2User(user.getId(), user.getSocialId(), user.getRole().getKey());
        Authentication authToken = new OAuth2AuthenticationToken(customOAuth2User, customOAuth2User.getAuthorities(), "naver");

        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

    private static String getAccessTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("Authorization")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        return token;
    }
}
