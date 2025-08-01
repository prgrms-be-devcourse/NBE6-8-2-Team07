package com.back.fairytale.domain.fairytale.repository;

import com.back.fairytale.domain.fairytale.entity.Fairytale;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FairytaleRepository extends JpaRepository<Fairytale, Long> {

    List<Fairytale> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    // 모든 사용자의 동화 조회 (공개용) - 새로 추가
    List<Fairytale> findAllOrderByCreatedAtDesc();

    // Fetch Join으로 N+1 해결 - 상세 조회
    @Query("SELECT f FROM Fairytale f " +
            "LEFT JOIN FETCH f.fairytaleKeywords fk " +
            "LEFT JOIN FETCH fk.keyword " +
            "WHERE f.id = :fairytaleId AND f.user.id = :userId")
    Optional<Fairytale> findByIdAndUserIdWithKeywordsFetch(@Param("fairytaleId") Long fairytaleId,
                                                           @Param("userId") Long userId);

    // Fetch Join으로 N+1 해결 - 상세 조회 (공개용) - 새로 추가
    @Query("SELECT f FROM Fairytale f " +
            "LEFT JOIN FETCH f.fairytaleKeywords fk " +
            "LEFT JOIN FETCH fk.keyword " +
            "WHERE f.id = :fairytaleId")
    Optional<Fairytale> findByIdWithKeywordsFetch(@Param("fairytaleId") Long fairytaleId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select f from Fairytale f where f.id = :id")
    Optional<Fairytale> findByIdWithPessimisticLock(@Param("id") Long id);

}