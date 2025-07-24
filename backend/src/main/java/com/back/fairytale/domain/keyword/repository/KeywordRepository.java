package com.back.fairytale.domain.keyword.repository;

import com.back.fairytale.domain.fairytale.entity.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KeywordRepository extends JpaRepository<Keyword, Long> {
}
