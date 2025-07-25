package com.back.fairytale.domain.bookmark.service;

import com.back.fairytale.domain.bookmark.dto.BookMarkDto;
import com.back.fairytale.domain.bookmark.entity.BookMark;
import com.back.fairytale.domain.bookmark.repository.BookMarkRepository;
import com.back.fairytale.domain.fairytale.entity.Fairytale;
import com.back.fairytale.domain.fairytale.repository.FairytaleRepository;
import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.user.repository.UserRepository;
import com.back.fairytale.domain.bookmark.exception.BookMarkAlreadyExistsException;
import com.back.fairytale.domain.bookmark.exception.BookMarkNotFoundException;
import com.back.fairytale.global.security.CustomOAuth2User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookMarkService {

    private final BookMarkRepository bookMarkRepository;
    private final UserRepository userRepository;
    private final FairytaleRepository fairytaleRepository;

    // 나중에 스트림으로 리펙토링
    public List<BookMarkDto> getBookMark(CustomOAuth2User oAuth2User) {
        User foundUser = userRepository.findById(oAuth2User.getId())
                .orElseThrow(() -> new BookMarkNotFoundException("해당 유저를 찾을 수 없습니다."));

        List<BookMark> bookMarks = bookMarkRepository.findByUserId(foundUser.getId());
        List<BookMarkDto> bookMarkDtos = new ArrayList<>();

        for (BookMark bookMark : bookMarks) {
            bookMarkDtos.add(BookMarkDto.builder()
                    .userId(bookMark.getUser().getId())
                    .fairytaleId(bookMark.getFairytale().getId())
                    .build());
        }
        return bookMarkDtos;
    }

    @Transactional
    public BookMark addBookMark(BookMarkDto bookMarkDto) {
        User user = userRepository.findById(bookMarkDto.getUserId())
                .orElseThrow(() -> new BookMarkNotFoundException("해당 유저를 찾을 수 없습니다."));
        Fairytale fairytale = fairytaleRepository.findById(bookMarkDto.getFairytaleId())
                .orElseThrow(() -> new BookMarkNotFoundException("해당 동화를 찾을 수 없습니다."));

        Optional<BookMark> existBookMark = bookMarkRepository.findByUserIdAndFairytaleId(user.getId(), fairytale.getId());
        if (existBookMark.isPresent()) {
            throw new BookMarkAlreadyExistsException("이미 즐겨찾기에 추가된 동화입니다.");
        }

        BookMark bookMark = BookMark.builder()
                .user(user)
                .fairytale(fairytale)
                .build();
        return bookMarkRepository.save(bookMark);
    }

    @Transactional
    public void removeBookMark(BookMarkDto bookMarkDto) {
        User user = userRepository.findById(bookMarkDto.getUserId())
                .orElseThrow(() -> new BookMarkNotFoundException("해당 유저를 찾을수 없습니다."));
        Fairytale fairytale = fairytaleRepository.findById(bookMarkDto.getFairytaleId())
                .orElseThrow(() -> new BookMarkNotFoundException("해당 동화를 찾을 수 없습니다."));

        BookMark bookMark = bookMarkRepository.findByUserIdAndFairytaleId(user.getId(), fairytale.getId())
                .orElseThrow(() -> new BookMarkNotFoundException("즐겨찾기에 없는 동화입니다."));

        bookMarkRepository.deleteById(bookMark.getId());
    }
}