package com.back.fairytale.domain.user.entity;

import com.back.fairytale.domain.bookmark.entity.BookMark;
import com.back.fairytale.domain.fairytale.entity.Fairytale;
import com.back.fairytale.domain.keyword.entity.Keyword;
import com.back.fairytale.domain.user.enums.IsDeleted;
import com.back.fairytale.domain.user.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(length = 20, unique = true)
    private String nickname;

    @Column(length = 50, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IsDeleted isDeleted;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Keyword> keywords = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Fairytale> fairytales = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookMark> favorites = new ArrayList<>();
}