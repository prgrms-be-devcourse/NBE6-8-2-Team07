package com.back.fairytale.global.security;

import java.util.Map;

public interface OAuth2UserManager {
    OAuth2UserInfo saveOrUpdateUser(Map<String, Object> userInfo);
}
