package com.back.fairytale.domain.fairytale.entity;

import com.back.fairytale.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Table(name = "fairytale")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Fairytale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "child_name", nullable = false, length = 100)
    private String childName;

    @Column(name = "child_role", nullable = false, length = 200)
    private String childRole;

    @Column(length = 200)
    private String characters;

    @Column(length = 200)
    private String place;

    @Column(length = 200)
    private String lesson;

    @Column(length = 200)
    private String mood;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "fairytale", fetch = LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FairytaleKeyword> fairytaleKeywords = new ArrayList<>();
}
