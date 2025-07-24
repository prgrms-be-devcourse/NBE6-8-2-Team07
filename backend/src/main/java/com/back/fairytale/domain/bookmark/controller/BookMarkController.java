package com.back.fairytale.domain.bookmark.controller;

import com.back.fairytale.domain.bookmark.dto.BookMarkDto;
import com.back.fairytale.domain.bookmark.service.BookMarkService;
import com.back.fairytale.domain.user.entity.User;
import com.back.fairytale.domain.bookmark.exception.BookMarkAlreadyExistsException;
import com.back.fairytale.domain.bookmark.exception.BookMarkNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookMarkController {

    private final BookMarkService bookMarkService;

    @GetMapping("/bookmarks")
    public ResponseEntity<List<BookMarkDto>> getFavorites(@AuthenticationPrincipal User user) {
        List<BookMarkDto> favorites = bookMarkService.getBookMark(user);
        return ResponseEntity.ok(favorites);
    }

    // controller에서 DTO를 만들어서 service에 전달해야 할까? 서비스 단에서 DTO를 만들어서 처리해야 할까?
    @PostMapping("/{fairytaleId}/bookmark")
    public ResponseEntity<String> addFavorite(@PathVariable Long fairytaleId, @AuthenticationPrincipal User user) {
        BookMarkDto bookMarkDto = BookMarkDto.builder()
                .userId(user.getId())
                .fairytaleId(fairytaleId)
                .build();
        try {
            bookMarkService.addBookMark(bookMarkDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("게시물 " + fairytaleId + " 즐겨찾기에 추가되었습니다.");
        } catch (BookMarkAlreadyExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (BookMarkNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{fairytaleId}/bookmark")
    public ResponseEntity<String> removeFavorite(@PathVariable Long fairytaleId, @AuthenticationPrincipal User user) {
        BookMarkDto bookMarkDto = BookMarkDto.builder()
                .userId(user.getId())
                .fairytaleId(fairytaleId)
                .build();
        try {
            bookMarkService.removeBookMark(bookMarkDto);
            return ResponseEntity.ok("게시물 " + fairytaleId + " 즐겨찾기에서 해제되었습니다.");
        } catch (BookMarkNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}