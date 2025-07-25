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
        return getFirstKeywordByType(KeywordType.아이이름);
    }

    public String getChildRole() {
        return getFirstKeywordByType(KeywordType.아이역할);
    }

    public String getCharacters() {
        return getJoinedKeywordsByType(KeywordType.캐릭터들);
    }

    public String getPlace() {
        return getJoinedKeywordsByType(KeywordType.장소);
    }

    public String getLesson() {
        return getJoinedKeywordsByType(KeywordType.교훈);
    }

    public String getMood() {
        return getJoinedKeywordsByType(KeywordType.분위기);
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
