package com.back.fairytale.domain.fairytale.entity;

import com.back.fairytale.domain.keyword.entity.Keyword;
import com.back.fairytale.domain.keyword.enums.KeywordType;
import com.back.fairytale.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static jakarta.persistence.FetchType.LAZY;
// test
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

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "fairytale", fetch = LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FairytaleKeyword> fairytaleKeywords = new ArrayList<>();

    public void addKeyword(Keyword keyword) {
        FairytaleKeyword fairytaleKeyword = FairytaleKeyword.builder()
                .fairytale(this)
                .keyword(keyword)
                .build();
        this.fairytaleKeywords.add(fairytaleKeyword);
    }

    public String getChildName() {
        return getFirstKeywordByType(KeywordType.CHILD_NAME);
    }

    public String getChildRole() {
        return getFirstKeywordByType(KeywordType.CHILD_ROLE);
    }

    public String getCharacters() {
        return getJoinedKeywordsByType(KeywordType.CHARACTERS);
    }

    public String getPlace() {
        return getJoinedKeywordsByType(KeywordType.PLACE);
    }

    public String getLesson() {
        return getJoinedKeywordsByType(KeywordType.LESSON);
    }

    public String getMood() {
        return getJoinedKeywordsByType(KeywordType.MOOD);
    }

    private String getFirstKeywordByType(KeywordType type) {
        return getKeywordsByType(type)
                .stream()
                .findFirst()
                .map(fk -> fk.getKeyword().getKeyword())
                .orElse(null);
    }

    private String getJoinedKeywordsByType(KeywordType type) {
        List<String> keywords = getKeywordsByType(type)
                .stream()
                .map(fk -> fk.getKeyword().getKeyword())
                .collect(Collectors.toList());

        return keywords.isEmpty() ? null : String.join(", ", keywords);
    }

    private List<FairytaleKeyword> getKeywordsByType(KeywordType type) {
        return fairytaleKeywords.stream()
                .filter(fk -> fk.getKeyword().getKeywordType() == type)
                .collect(Collectors.toList());
    }
}
