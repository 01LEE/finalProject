package com.rental.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/upload-image")  // 이 경로로 파일 업로드 요청을 받습니다.
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    private static final String IMAGE_UPLOAD_DIR = "C:/car-images/";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(@RequestPart("image") MultipartFile image) {
        try {
            String originalFilename = image.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String imageName = UUID.randomUUID().toString() + extension;
            File destFile = new File(IMAGE_UPLOAD_DIR + imageName);
            if (!destFile.getParentFile().exists()) {
                destFile.getParentFile().mkdirs();
            }
            image.transferTo(destFile);
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", "/car-images/" + imageName);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
