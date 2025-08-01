package com.back.fairytale.domain.thoughts.repository;

import com.back.fairytale.domain.thoughts.entity.Thoughts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThoughtsRepository extends JpaRepository<Thoughts, Long> {
}
