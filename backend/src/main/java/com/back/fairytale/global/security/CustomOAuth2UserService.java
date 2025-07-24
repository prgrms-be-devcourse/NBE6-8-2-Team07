package com.back.fairytale.global.security;

import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.enums.IsDeleted;
import com.back.fairytale.domain.user.enums.Role;
import com.back.fairytale.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("oAuth2User = {}", oAuth2User);

        Map<String, String> response = (Map<String, String>)  oAuth2User.getAttributes().get("response");
        log.info("oAuth2User.getAttributes() = {}", response);

        User user = saveOrUpdate(response);
        return null; // todo Spring Security 인증 객체를 반환하도록 변경
    }

    private User saveOrUpdate(Map<String, String> response) {
        User user = userRepository.findBySocialId(response.get("id"))
                .map(entity -> entity.update(response.get("name"),
                        response.get("nickname"),
                        response.get("email")))
                .orElse(createUser(response));
        return userRepository.save(user);
    }

    private static User createUser(Map<String, String> response) {
        return User.builder()
                .socialId(response.get("id"))
                .name(response.get("name"))
                .nickname(response.get("nickname"))
                .email(response.get("email"))
                .role(Role.USER)
                .isDeleted(IsDeleted.NOT_DELETED)
                .build();
    }
}
