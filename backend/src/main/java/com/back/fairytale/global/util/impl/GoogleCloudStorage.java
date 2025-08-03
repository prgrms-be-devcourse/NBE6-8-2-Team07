package com.back.fairytale.global.util.impl;

import com.back.fairytale.global.util.CloudStorage;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class GoogleCloudStorage implements CloudStorage {

    private Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    @Autowired
    public GoogleCloudStorage(Storage storage, @Value("${spring.cloud.gcp.storage.bucket}") String bucketName) {
        this.storage = storage;
        this.bucketName = bucketName;
    }

    // 이미지 업로드 이미지가 하나거나 여러개를 업로드 할 수 있기 때문
    public List<String> uploadImages(List<MultipartFile> imgFiles) {

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : imgFiles) {
            try {
                imageUrls.add(uploadImageToCloud(file));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return imageUrls;
    }

    // 이미지 삭제 -> 뭉터기로 삭제하는게 아니기 떄문에 단일로?
    public void deleteImage(Long id) {
        BlobId blobId = BlobId.of(bucketName, String.valueOf(id));
        boolean result = storage.delete(blobId);
        if (!result) {
            throw new RuntimeException("클라우드에서 이미지 삭제 실패");
        }
    }

    // 이미지 업데이트 -> 수정 해야됨 List로
    public void updateImages(Long id, MultipartFile image) {
        deleteImage(id);
        try {
            uploadImageToCloud(image);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String uploadImageToCloud(MultipartFile imgFile) throws IOException {

        String uuid = UUID.randomUUID().toString();

        BlobInfo blobInfo = storage.create(
                BlobInfo.newBuilder(bucketName, uuid)
                        .setContentType(imgFile.getContentType())
                        .build(),
                imgFile.getInputStream()
        );

        return blobInfo.getMediaLink();
    }

}
