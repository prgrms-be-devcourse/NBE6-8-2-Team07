package com.back.fairytale.domain.keyword.controller;


import com.back.fairytale.domain.keyword.service.KeywordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class KeywordController {
    private final KeywordService keywordService;


}
