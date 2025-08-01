package com.back.fairytale.global.util.impl;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@ActiveProfiles("dev")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest
public class GoogleCloudStorgeTest {

    @Autowired
    private GoogleCloudStorge googleCloudStorge;

    @Test
    @DisplayName("이미지 업로드 테스트")
    void uploadImages() throws IOException {
        // given
        MockMultipartFile file1 = new MockMultipartFile("file1", "KakaoTalk_20250506_000056994.jpg", "image/jpeg", "test-data-1".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("file2", "KakaoTalk_20250506_000056994.jpg", "image/png", "test-data-2".getBytes());
        List<MultipartFile> multipartFiles = Arrays.asList(file1, file2);

        // when
        List<String> imageUrls = googleCloudStorge.uploadImages(multipartFiles);

        // then
        assertNotNull(imageUrls);
        assertEquals(2, imageUrls.size());
        imageUrls.forEach(System.out::println);

    }
}
