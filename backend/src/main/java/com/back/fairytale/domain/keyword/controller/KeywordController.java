package com.back.fairytale.domain.keyword.controller;


import com.back.fairytale.domain.keyword.service.KeywordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.back.fairytale.domain.keyword.dto.KeywordResponseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import java.util.List;
import com.back.fairytale.domain.keyword.dto.KeywordRequestDto;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class KeywordController {
    private final KeywordService keywordService;

    @GetMapping("/keywords")
    public ResponseEntity<List<KeywordResponseDto>> getAllKeywords() {
        List<KeywordResponseDto> keywords = keywordService.getAllKeywords();
        return ResponseEntity.ok(keywords);
    }

    @PostMapping("/keywords")
    public ResponseEntity<KeywordResponseDto> createKeyword(@RequestBody KeywordRequestDto requestDto) {
        KeywordResponseDto responseDto = keywordService.createKeyword(requestDto);
        return ResponseEntity.ok(responseDto);
    }
}
