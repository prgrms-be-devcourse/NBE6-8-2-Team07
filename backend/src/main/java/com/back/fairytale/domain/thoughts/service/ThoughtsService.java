package com.back.fairytale.domain.thoughts.service;

import com.back.fairytale.domain.fairytale.entity.Fairytale;
import com.back.fairytale.domain.fairytale.repository.FairytaleRepository;
import com.back.fairytale.domain.thoughts.entity.Thoughts;
import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ThoughtsService {

    private final ThoughtsRepository thoughtsRepository;
    private final UserRepository userRepository;
    private final FairytaleRepository fairytaleRepository;

    // 공통 로직
    // 아이생각 조회 및 유저 확인
    private Thoughts findThoughtAndCheckUser(Long id, Long userId) {
        // 아이생각 조회
        Thoughts thoughts = thoughtsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thoughts not found with id: " + id));

        // 유저 확인
        if (!thoughts.getUser().getId().equals(userId)) {
            throw new RuntimeException("User not authorized to access this thoughts");
        }

        return thoughts;
    }

    // 아이생각 작성
    public ThoughtsResponse createThoughts(ThoughtsRequest request, Long userId) {
        // 유저와 동화조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Fairytale fairytale = fairytaleRepository.findById(request.getFairytaleId())
                .orElseThrow(() -> new RuntimeException("Fairytale not found with id: " + request.getFairytaleId()));

        // 아이생각 생성
        Thoughts thoughts = Thoughts.builder()
                .fairytale(fairytale)
                .user(user)
                .name(request.getName())
                .content(request.getContent())
                .parentContent(request.getParentContent())
                .build();

        // 아이생각 저장
        Thoughts savedThoughts = thoughtsRepository.save(thoughts);

        // 응답 생성
        return new ThoughtsResponse(savedThoughts);
    }

    // 아이생각 조회
    @Transactional(readOnly = true)
    public ThoughtsResponse getThoughts(Long id, Long userId) {
        // 아이생각 조회 및 유저 확인
        Thoughts thoughts = findThoughtAndCheckUser(id, userId);

        // 응답 생성
        return new ThoughtsResponse(thoughts);
    }

    // 아이생각 수정
    public ThoughtsResponse updateThoughts(Long id, ThoughtsUpdateRequest request, Long userId) {
        // 아이생각 조회 및 유저 확인
        Thoughts thoughts = findThoughtAndCheckUser(id, userId);

        // 아이생각 수정
        thoughts.update(request.getName(), request.getContent(), request.getParentContent());

        // 응답 생성
        return new ThoughtsResponse(thoughts);
    }

    // 아이생각 삭제
    public void deleteThoughts(Long id, Long userId) {
        // 아이생각 조회 및 유저 확인
        Thoughts thoughts = findThoughtAndCheckUser(id, userId);

        // 아이생각 삭제
        thoughtsRepository.delete(thoughts);

        log.info("Thoughts with id {} deleted successfully", id);
    }
}
