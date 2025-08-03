package com.back.fairytale.global.util;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CloudStorage {

    List<String> uploadImages(List<MultipartFile> image);

    void deleteImage(Long id);

    void updateImages(Long id, MultipartFile image);

}
