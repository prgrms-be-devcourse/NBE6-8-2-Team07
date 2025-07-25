package com.back.fairytale.domain.like.service;

import com.back.fairytale.domain.fairytale.entity.Fairytale;
import com.back.fairytale.domain.fairytale.repository.FairytaleRepository;
import com.back.fairytale.domain.like.dto.LikeDto;
import com.back.fairytale.domain.like.entity.Like;
import com.back.fairytale.domain.like.exception.LikeAlreadyExistsException;
import com.back.fairytale.domain.like.exception.LikeNotFoundException;
import com.back.fairytale.domain.like.repository.LikeRepository;
import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.repository.UserRepository;
import com.back.fairytale.global.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final FairytaleRepository fairytaleRepository;

    // 나중에 스트림으로 리펙토링
    @Transactional
    public List<LikeDto> getLikes(CustomOAuth2User user) {
        List<Like> likes = likeRepository.findByUserId(user.getId());
        List<LikeDto> likeDtos = new ArrayList<>();

        for (Like like : likes) {
            likeDtos.add(LikeDto.builder()
                    .userId(like.getUser().getId())
                    .fairytaleId(like.getFairytale().getId())
                    .build());
        }

        return likeDtos;
    }

    @Transactional
    public Like addLike(LikeDto likeDto) {

        User user = userRepository.findById(likeDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));

        Fairytale fairytale = fairytaleRepository.findById(likeDto.getFairytaleId())
                .orElseThrow(() -> new IllegalArgumentException("해당 동화를 찾을 수 없습니다."));

        Optional<Like> existLike = likeRepository.findByUserIdAndFairytaleId(user.getId(), fairytale.getId());
        if (existLike.isPresent()) {
            throw new LikeAlreadyExistsException("이미 좋아요를 누른 동화입니다.");
        }

        Like like = Like.builder()
                .user(user)
                .fairytale(fairytale)
                .build();

        return likeRepository.save(like);
    }

    @Transactional
    public void removeLike(LikeDto likeDto) {
        User user = userRepository.findById(likeDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));
        Fairytale fairytale = fairytaleRepository.findById(likeDto.getFairytaleId())
                .orElseThrow(() -> new IllegalArgumentException("해당 동화를 찾을 수 없습니다."));

        Like like = likeRepository.findByUserIdAndFairytaleId(user.getId(), fairytale.getId())
                .orElseThrow(() -> new LikeNotFoundException("좋아요가 없는 동화입니다."));

        likeRepository.deleteById(like.getId());

    }
}
