package com.back.fairytale.global.security;

import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.enums.IsDeleted;
import com.back.fairytale.domain.user.enums.Role;
import com.back.fairytale.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
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
        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> response = (Map<String, Object>)  attributes.get("response");
        log.info("oAuth2User.getAttributes() = {}", response);

        User user = saveOrUpdate(response);
        return new CustomOAuth2User(user.getId(),
                Collections.singleton(new SimpleGrantedAuthority(user.getRole().getKey())),
                response,
                "id");
    }

    private User saveOrUpdate(Map<String, Object> response) {
        User user = userRepository.findBySocialId(response.get("id").toString())
                .map(entity -> entity.update(response.get("name").toString(),
                        response.get("nickname").toString(),
                        response.get("email").toString()))
                .orElse(createUser(response));
        return userRepository.save(user);
    }

    private static User createUser(Map<String, Object> response) {
        return User.builder()
                .socialId(response.get("id").toString())
                .name(response.get("name").toString())
                .nickname(response.get("nickname").toString())
                .email(response.get("email").toString())
                .role(Role.USER)
                .isDeleted(IsDeleted.NOT_DELETED)
                .build();
    }
}
