package com.back.fairytale.domain.user.service;


import com.back.fairytale.global.security.JWTProvider;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Slf4j
@Service
public class AuthService {

    private final JWTProvider jwtProvider;

    public String reissueAccessToken(String refreshToken) {
        return jwtProvider.reissueAccessToken(refreshToken);
    }

    public Cookie createAccessTokenCookie(String token) {
        return jwtProvider.wrapAccessTokenToCookie(token);
    }

    public String getRefreshTokenFromCookies(Cookie[] cookies) {
        return jwtProvider.extractRefreshToken(cookies);
    }
}