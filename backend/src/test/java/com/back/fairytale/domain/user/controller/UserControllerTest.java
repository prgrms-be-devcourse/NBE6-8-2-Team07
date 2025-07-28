package com.back.fairytale.domain.user.controller;

import com.back.fairytale.domain.user.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private UserController userController;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Test
    @DisplayName("토큰 재발급이 성공적으로 이루어진다.")
    void reissue_Success() {
        // Given
        String refreshToken = "valid-refresh-token";
        String newAccessToken = "new-access-token";
        String newRefreshToken = "new-refresh-token";
        Cookie[] cookies = {new Cookie("refreshToken", refreshToken)};
        Cookie accessTokenCookie = new Cookie("accessToken", newAccessToken);
        Cookie refreshTokenCookie = new Cookie("refreshToken", newRefreshToken);

        when(request.getCookies()).thenReturn(cookies);
        when(authService.getRefreshTokenFromCookies(cookies)).thenReturn(refreshToken);
        when(authService.reissueAccessToken(refreshToken)).thenReturn(newAccessToken);
        when(authService.reissueRefreshToken(refreshToken)).thenReturn(newRefreshToken);
        when(authService.createAccessTokenCookie(newAccessToken)).thenReturn(accessTokenCookie);
        when(authService.createRefreshTokenCookie(newRefreshToken)).thenReturn(refreshTokenCookie);

        // When
        ResponseEntity<?> result = userController.reissue(request, response);

        // Then
        assertThat(result.getStatusCode()).isEqualTo((HttpStatus.OK));
    }

    @Test
    @DisplayName("잘못된 리프레시 토큰으로 재발급 시 실패한다.")
    void reissue_InvalidRefreshToken_Failure() {
        // Given
        String invalidRefreshToken = "invalid-refresh-token";
        String errorMessage = "Invalid refresh token";
        Cookie[] cookies = {new Cookie("refreshToken", invalidRefreshToken)};

        when(request.getCookies()).thenReturn(cookies);
        when(authService.getRefreshTokenFromCookies(cookies)).thenReturn(invalidRefreshToken);
        when(authService.reissueAccessToken(invalidRefreshToken))
                .thenThrow(new IllegalArgumentException(errorMessage));

        // When
        ResponseEntity<?> result = userController.reissue(request, response);

        // Then
        assertThat(result.getStatusCode()).isEqualTo((HttpStatus.BAD_REQUEST));
        assertThat(result.getBody()).isEqualTo(errorMessage);
        verify(authService, never()).reissueRefreshToken(anyString());
        verify(response, never()).addCookie(any(Cookie.class));
    }

    @Test
    @DisplayName("리프레시 토큰 재발급 과정에서 예외가 발생한다.")
    void reissue_NewRefreshTokenFailure() {
        // Given
        String refreshToken = "valid-refresh-token";
        String newAccessToken = "new-access-token";
        String errorMessage = "Failed to reissue refresh token";
        Cookie[] cookies = {new Cookie("refreshToken", refreshToken)};

        when(request.getCookies()).thenReturn(cookies);
        when(authService.getRefreshTokenFromCookies(cookies)).thenReturn(refreshToken);
        when(authService.reissueAccessToken(refreshToken)).thenReturn(newAccessToken);
        when(authService.reissueRefreshToken(refreshToken))
                .thenThrow(new IllegalArgumentException(errorMessage));

        // When
        ResponseEntity<?> result = userController.reissue(request, response);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(result.getBody()).isEqualTo(errorMessage);
        verify(response, never()).addCookie(any(Cookie.class));
    }
}
