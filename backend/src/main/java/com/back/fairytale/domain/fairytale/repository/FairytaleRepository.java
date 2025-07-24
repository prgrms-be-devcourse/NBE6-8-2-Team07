package com.back.fairytale.domain.fairytale.repository;

import com.back.fairytale.domain.fairytale.entity.Fairytale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FairytaleRepository extends JpaRepository<Fairytale, Long> {
}