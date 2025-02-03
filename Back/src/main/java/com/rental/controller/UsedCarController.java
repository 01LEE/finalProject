package com.rental.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.dto.UsedCarDTO;
import com.rental.service.UsedCarService;

import java.util.ArrayList;
import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/used-cars")
@CrossOrigin(origins = "http://localhost:3000") // CORS 허용
public class UsedCarController {

    private final UsedCarService usedCarService;

    // 이미지 저장 경로
    private static final String IMAGE_UPLOAD_DIR = "C:/car-images/";

    public UsedCarController(UsedCarService usedCarService) {
        this.usedCarService = usedCarService;
    }

    // ✅ 필터된 중고차 목록 조회 (정렬 포함)
    @GetMapping("/getFilteredUsedCars")
    public List<UsedCarDTO> getAllUsedCars(
        @RequestParam(required = false) String vehicleName,
        @RequestParam(required = false) String vehicleType,
        @RequestParam(required = false) String brand,
        @RequestParam(required = false) Integer modelYear,
        @RequestParam(required = false) Integer minPrice,
        @RequestParam(required = false) Integer maxPrice,
        @RequestParam(required = false) String color,
        @RequestParam(required = false) String dealerLocation,
        @RequestParam(required = false) String fuelType,
        @RequestParam(required = false) String transmission,
        @RequestParam(required = false) String driveType,
        @RequestParam(required = false) Integer minKm,
        @RequestParam(required = false) Integer maxKm,
        @RequestParam(required = false) Integer seatingCapacity,
        @RequestParam(required = false, defaultValue = "car_km") String sortBy,
        @RequestParam(required = false, defaultValue = "asc") String order
    ) {
        // 🚀 정렬 로그 추가
        System.out.println("📌 정렬 요청 확인: sortBy=" + sortBy + ", order=" + order);

        // 🚀 정렬 유효성 검사
        if (!isValidSortBy(sortBy)) {
            sortBy = "car_km";
        }
        if (!isValidOrder(order)) {
            order = "asc";
        }

        List<UsedCarDTO> cars = usedCarService.getFilteredUsedCars(
            vehicleName, vehicleType, brand, modelYear, minPrice, maxPrice, color, dealerLocation,
            fuelType, transmission, driveType, minKm, maxKm, seatingCapacity, sortBy, order
        );

        // 🚀 대표 이미지 설정
        cars.forEach(car -> {
            if (car.getUsedCarImage() != null && !car.getUsedCarImage().isEmpty()) {
                car.setMainImage(car.getUsedCarImage().split(",")[0]);
            } else {
                car.setMainImage("/default-image.png");
            }
        });

        return cars;
    }

    // ✅ 차량 상세 조회
    @GetMapping("/detail")
    public UsedCarDTO getCarDetail(@RequestParam String vehicleNo) {
        UsedCarDTO carDTO = usedCarService.getCarByVehicleNo(vehicleNo);

        if (carDTO.getUsedCarImage() != null && !carDTO.getUsedCarImage().isEmpty()) {
            carDTO.setMainImage(carDTO.getUsedCarImage().split(",")[0]);
        } else {
            carDTO.setMainImage("/default-image.png");
        }

        System.out.println("📌 반환된 차량 데이터: " + carDTO);
        return carDTO;
    }

    // ✅ 차량 정보 수정 (이미지 포함)
    @PostMapping("/update-car-details")
    public ResponseEntity<String> updateCarDetails(
        @RequestPart(value = "carData", required = true) String carDataJson,
        @RequestPart(value = "images", required = false) MultipartFile[] images
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UsedCarDTO carDTO = objectMapper.readValue(carDataJson, UsedCarDTO.class);

            List<String> imagePaths = new ArrayList<>();
            if (images != null && images.length > 0) {
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        String imageName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                        File destFile = new File(IMAGE_UPLOAD_DIR + imageName);

                        if (!destFile.getParentFile().exists()) {
                            destFile.getParentFile().mkdirs();
                        }

                        image.transferTo(destFile);
                        imagePaths.add("/car-images/" + imageName);
                    }
                }
            }

            // 기존 이미지 처리
            String savedImages = String.join(",", imagePaths);
            String mainImage = savedImages.isEmpty() ? carDTO.getMainImage() : imagePaths.get(0);

            usedCarService.updateCarDetails(
                carDTO.getVehicleNo(),
                carDTO.getVehicleName(),
                carDTO.getBrand(),
                carDTO.getModelYear(),
                carDTO.getPrice(),
                carDTO.getColor(),
                carDTO.getFuelType(),
                carDTO.getTransmission(),
                carDTO.getDriveType(),
                carDTO.getSeatingCapacity(),
                savedImages.isEmpty() ? carDTO.getUsedCarImage() : savedImages,
                carDTO.getCar_km(),
                mainImage,
                carDTO.getDeletedImages()
            );

            return ResponseEntity.ok("차량 정보 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 실패: " + e.getMessage());
        }
    }

    // 🚀 정렬 기준 유효성 검사
    private boolean isValidSortBy(String sortBy) {
        return sortBy != null && (
            sortBy.equals("car_km") ||
            sortBy.equals("price") ||
            sortBy.equals("model_year")
        );
    }

    // 🚀 정렬 방식 유효성 검사
    private boolean isValidOrder(String order) {
        return order != null && (order.equals("asc") || order.equals("desc"));
    }
}
