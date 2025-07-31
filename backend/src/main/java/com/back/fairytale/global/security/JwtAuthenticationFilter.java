package com.back.fairytale.global.security;

import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.repository.UserRepository;
import com.back.fairytale.domain.user.service.AuthService;
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
    private final JWTProvider jwtProvider;
    private final UserRepository userRepository;
    private final AuthService authService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/h2-console") || request.getRequestURI().equals("/reissue");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = getAccessTokenFromCookies(request);

        if (accessToken == null) {
            log.info("요청에 JWT 토큰이 없습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        if (jwtUtil.validateToken(accessToken)) {
            log.info("유효한 액세스 토큰입니다.");
            authenticateUser(accessToken, request, response, filterChain);
            return;
        }

        String refreshToken = getRefreshTokenFromCookies(request);
        if (refreshToken == null) {
            log.info("요청에 리프레시 토큰이 없습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        if (!jwtUtil.validateToken(refreshToken)) {
            log.info("리프레시 토큰이 유효하지 않습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 리프레시 토큰에서 사용자 ID 추출
            Long userId = jwtUtil.getUserId(refreshToken);
            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isEmpty()) {
                log.warn("리프레시 토큰의 사용자를 찾을 수 없습니다. ID: {}", userId);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            User user = optionalUser.get();
            if(!refreshToken.equals(user.getRefreshToken())) {
                log.warn("리프레시 토큰이 일치하지 않습니다. 사용자 ID: {}", userId);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            String newAccessToken = jwtProvider.createAccessToken(user.getId(), user.getRole().getKey());
            String newRefreshToken = jwtProvider.createRefreshToken(user.getId(), user.getRole().getKey());
            user.setRefreshToken(newRefreshToken);
            userRepository.save(user);

            response.addCookie(jwtProvider.wrapAccessTokenToCookie(newAccessToken));
            response.addCookie(jwtProvider.wrapRefreshTokenToCookie(newRefreshToken));

            log.info("새로운 액세스 토큰이 발급되었습니다. 사용자 ID: {}", userId);

            CustomOAuth2User customOAuth2User = new CustomOAuth2User(user.getId(), user.getSocialId(), user.getRole().getKey());
            Authentication authToken = new OAuth2AuthenticationToken(customOAuth2User, customOAuth2User.getAuthorities(), "naver");
            SecurityContextHolder.getContext().setAuthentication(authToken);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("토큰 갱신 중 오류 발생: ", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
    }

    private void authenticateUser(String accessToken, HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
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

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        return token;
    }
}
