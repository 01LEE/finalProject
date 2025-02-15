package com.rental.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.dto.UsedCarDTO;
import com.rental.dto.UsedCarImageDTO;
import com.rental.service.UsedCarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/used-cars")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // React 연동 시 CORS 해결
public class AdminUsedCarController {

    private final UsedCarService usedCarService;
    private static final String IMAGE_UPLOAD_DIR = "C:/car-images/";
    private static final String DEFAULT_IMAGE_URL = "/images/usedcar_imageX.png";

    // 전체 중고차 목록 조회 API
    @GetMapping
    public ResponseEntity<List<UsedCarDTO>> getAllUsedCars() {
        List<UsedCarDTO> usedCars = usedCarService.getAllUsedCars();
        return ResponseEntity.ok(usedCars);
    }

    // 차량 삭제 API
    @DeleteMapping("/{vehicleNo}")
    public ResponseEntity<String> deleteUsedCar(@PathVariable String vehicleNo) {
        usedCarService.deleteUsedCar(vehicleNo);
        return ResponseEntity.ok("삭제 완료");
    }

    // 차량 등록(INSERT) API
    @PostMapping(value = "/add-car-details", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addCarDetails(
            @RequestPart("carData") String carDataJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images) {
        try {
            // 1. JSON 문자열을 UsedCarDTO로 변환
            ObjectMapper mapper = new ObjectMapper();
            UsedCarDTO usedCarDTO = mapper.readValue(carDataJson, UsedCarDTO.class);

            // 2. 이미지 파일 처리
            List<UsedCarImageDTO> imageDTOList = new ArrayList<>();
            if (images != null && images.length > 0) {
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        UsedCarImageDTO imageDTO = saveImageToStorage(image);
                        imageDTOList.add(imageDTO);
                    }
                }
            }

            // 3. 대표 이미지 설정: 사용자가 mainImage를 따로 지정하지 않은 경우,
            //    이미지 파일 목록이 있으면 첫 번째 이미지 URL, 없으면 기본 이미지를 사용
            if (usedCarDTO.getMainImage() == null || usedCarDTO.getMainImage().trim().isEmpty()) {
                if (!imageDTOList.isEmpty()) {
                    usedCarDTO.setMainImage(imageDTOList.get(0).getImageUrl());
                } else {
                    usedCarDTO.setMainImage(DEFAULT_IMAGE_URL);
                }
            }

            // 4. 서비스 레이어를 통해 차량 정보와 이미지 정보를 저장
            usedCarService.addCarDetails(usedCarDTO, imageDTOList);

            return ResponseEntity.ok("차량 등록이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("등록 중 오류 발생: " + e.getMessage());
        }
    }

    // 이미지 파일을 로컬 스토리지에 저장하고 URL을 생성
    private UsedCarImageDTO saveImageToStorage(MultipartFile image) throws IOException {
        String originalFileName = image.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String imageName = UUID.randomUUID().toString() + fileExtension;
        File destFile = new File(IMAGE_UPLOAD_DIR + imageName);

        if (!destFile.getParentFile().exists()) {
            destFile.getParentFile().mkdirs();
        }

        image.transferTo(destFile);

        UsedCarImageDTO imageDTO = new UsedCarImageDTO();
        imageDTO.setImageUrl("/car-images/" + imageName);
        return imageDTO;
    }

    
}
