package com.back.fairytale.global.util.impl;

import com.back.fairytale.global.util.CloudStorage;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GoogleCloudStorage implements CloudStorage {

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    private final Storage storage;

    @Override
    public List<String> uploadImages(List<MultipartFile> imgFiles) {

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : imgFiles) {
            imageUrls.add(uploadImageToCloud(file));
        }
        return imageUrls;
    }

    @Override
    public void deleteImages(List<String> imageUrls) {
        for (String imageUrl : imageUrls) {
            deleteImageFromCloud(imageUrl);
        }
    }

    @Override
    public void updateImages(List<String> imageUrl, List<MultipartFile> images) {
        deleteImages(imageUrl);
        uploadImages(images);
    }

    private String uploadImageToCloud(MultipartFile imgFile) {

        String uuid = UUID.randomUUID().toString();

        // Google Cloud Storage에 업로드할 Blob 정보 생성
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, uuid)
                .setContentType(imgFile.getContentType())
                .build();

        // Google Cloud Storage에 이미지 업로드
        try {
            storage.create(blobInfo, imgFile.getInputStream());
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 실패: " + e.getMessage(), e);
        }

        return formatUrl(uuid);
    }

    private void deleteImageFromCloud(String imageUrl) {
        BlobId blobId = BlobId.of(bucketName, imageUrl.substring(imageUrl.lastIndexOf("/") + 1));

        // Google Cloud Storage에서 이미지 삭제
        boolean result = storage.delete(blobId);
        if (!result) {
            throw new RuntimeException("클라우드에서 이미지 삭제 실패");
        }
    }

    private String formatUrl(String uuid) {
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, uuid);
    }
}