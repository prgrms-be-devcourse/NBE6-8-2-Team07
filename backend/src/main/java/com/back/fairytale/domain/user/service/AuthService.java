package com.back.fairytale.domain.user.service;


import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.repository.UserRepository;
import com.back.fairytale.global.security.JWTProvider;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
public class AuthService {

    private final JWTProvider jwtProvider;
    private final UserRepository userRepository;

    public String getRefreshTokenFromCookies(Cookie[] cookies) {
        return jwtProvider.extractRefreshToken(cookies);
    }

    public String reissueAccessToken(String refreshToken) {
        User user = validateRefreshTokenAndGetUser(refreshToken);
        return jwtProvider.createAccessToken(user.getId(), user.getRole().getKey());
    }

    @Transactional
    public String reissueRefreshToken(String refreshToken) {
        User user = validateRefreshTokenAndGetUser(refreshToken);

        String newRefreshToken = jwtProvider.createRefreshToken(user.getId(), user.getRole().getKey());
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        return newRefreshToken;
    }

    public Cookie createAccessTokenCookie(String token) {
        return jwtProvider.wrapAccessTokenToCookie(token);
    }

    public Cookie createRefreshTokenCookie(String refreshToken) {
        return jwtProvider.wrapRefreshTokenToCookie(refreshToken);
    }

    private User validateRefreshTokenAndGetUser(String refreshToken) {
        if (!jwtProvider.validateRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Refresh token이 유효하지 않습니다.");
        }

        Long userId = jwtProvider.getUserIdFromRefreshToken(refreshToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다. " + userId));

        if (!refreshToken.equals(user.getRefreshToken())) {
            throw new IllegalArgumentException("Refresh Token이 일치하지 않습니다.");
        }

        return user;
    }
}