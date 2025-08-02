package com.back.fairytale.domain.comments.repository;

import com.back.fairytale.domain.comments.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentsRepository extends JpaRepository<Comments, Long> {
}
