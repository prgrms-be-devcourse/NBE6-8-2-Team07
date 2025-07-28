package com.back.fairytale.domain.fairytale.repository;

import com.back.fairytale.domain.fairytale.entity.Fairytale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FairytaleRepository extends JpaRepository<Fairytale, Long> {
    List<Fairytale> findAllByOrderByCreatedAtDesc();

    List<Fairytale> findAllByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Fairytale> findByIdAndUserId(Long id, Long userId);
}