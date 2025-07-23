package com.back.fairytale.domain.user.repository;

import com.back.fairytale.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
