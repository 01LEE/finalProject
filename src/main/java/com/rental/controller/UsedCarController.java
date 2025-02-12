package com.rental.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.dto.UsedCarDTO;
import com.rental.dto.UsedCarImageDTO;
import com.rental.service.UsedCarService;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.core.type.TypeReference;

@RestController
@RequestMapping("/used-cars")
@CrossOrigin(origins = "http://localhost:3000") // CORS 허용
public class UsedCarController {

    private final UsedCarService usedCarService;
    private static final String IMAGE_UPLOAD_DIR = "C:/car-images/";
    private static final String DEFAULT_IMAGE_URL = "/images/usedcar_imageX.png";

    public UsedCarController(UsedCarService usedCarService) {
        this.usedCarService = usedCarService;
    }

    // 🚗 필터된 중고차 목록 조회 (정렬 포함)
    @GetMapping("/getFilteredUsedCars")
    public List<UsedCarDTO> getFilteredUsedCars(
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
            @RequestParam(required = false, defaultValue = "asc") String order) {
        if (!isValidSortBy(sortBy)) {
            sortBy = "car_km";
        }
        if (!isValidOrder(order)) {
            order = "asc";
        }

        List<UsedCarDTO> cars = usedCarService.getFilteredUsedCars(
                vehicleName, vehicleType, brand, modelYear, minPrice, maxPrice, color, dealerLocation,
                fuelType, transmission, driveType, minKm, maxKm, seatingCapacity, sortBy, order);

        // 기본 이미지 적용
        for (UsedCarDTO car : cars) {
            if (car.getMainImage() == null || car.getMainImage().isEmpty()) {
                car.setMainImage(DEFAULT_IMAGE_URL);
            }
        }

        return cars;
    }

    // 🚗 차량 상세 조회
    @GetMapping("/detail")
    public UsedCarDTO getCarDetail(@RequestParam String vehicleNo) {
        UsedCarDTO carDTO = usedCarService.getCarByVehicleNo(vehicleNo);
        System.out.println("detail : " + carDTO);

        List<UsedCarImageDTO> carImages = carDTO.getUsedCarImages();
        if (carImages != null && !carImages.isEmpty()) {
            for (UsedCarImageDTO imageDTO : carImages) {
                if ("Y".equals(imageDTO.getMainImage())) {
                    carDTO.setMainImage(imageDTO.getImageUrl());
                    System.out.println("Main image from server: " + imageDTO.getImageUrl());
                    break;
                }
            }
        }

        if (carDTO.getMainImage() == null || carDTO.getMainImage().isEmpty()) {
            carDTO.setMainImage(DEFAULT_IMAGE_URL);
        }

        return carDTO;
    }

    // 차량 정보 수정 (이미지 포함)
    @PostMapping(value = "/update-car-details", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateCarDetails(
            @RequestPart(value = "carData") String carDataJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images,
            @RequestPart(value = "deletedImages", required = false) String deletedImagesJson,
            @RequestPart(value = "mainImageId", required = false) Long mainImageId) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UsedCarDTO carDTO = objectMapper.readValue(carDataJson, UsedCarDTO.class);

            List<String> deletedImages = new ArrayList<>();
            if (deletedImagesJson != null && !deletedImagesJson.isEmpty()) {
                deletedImages = objectMapper.readValue(deletedImagesJson, new TypeReference<List<String>>() {});
            }

            if (deletedImages != null && !deletedImages.isEmpty()) {
                usedCarService.deleteUsedCarImages(deletedImages, carDTO.getVehicleNo());
            }

            List<UsedCarImageDTO> newlySavedImages = new ArrayList<>();
            if (images != null && images.length > 0) {
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        UsedCarImageDTO newImageDTO = saveImageToStorage(image);
                        System.out.println("Image saved: " + newImageDTO.getImageUrl());
                        newImageDTO.setVehicleNo(carDTO.getVehicleNo());
                        usedCarService.addUsedCarImage(newImageDTO);
                        newlySavedImages.add(newImageDTO);
                    }
                }
            }

            if (mainImageId != null) {
                System.out.println("Updating main image status using mainImageId: " + mainImageId);
                usedCarService.updateMainImageStatus(carDTO.getVehicleNo(), "N");
                usedCarService.updateMainImageStatusById(mainImageId, "Y");
                UsedCarImageDTO selectedMainImage = usedCarService.getUsedCarImageById(mainImageId);
                carDTO.setMainImage(selectedMainImage.getImageUrl());
            } else if (carDTO.getMainImage() == null || carDTO.getMainImage().isEmpty()) {
                if (!newlySavedImages.isEmpty()) {
                    UsedCarImageDTO newMainImage = newlySavedImages.get(0);
                    carDTO.setMainImage(newMainImage.getImageUrl());
                } else {
                    System.out.println("No main image available, using default image.");
                    carDTO.setMainImage(DEFAULT_IMAGE_URL);
                }
            }

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
                    carDTO.getCar_km(),
                    carDTO.getMainImage());

            return ResponseEntity.ok("차량 정보 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 실패: " + e.getMessage());
        }
    }

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
        System.out.println("Saved image URL: " + imageDTO.getImageUrl());
        return imageDTO;
    }

    private boolean isValidSortBy(String sortBy) {
        return sortBy != null && (sortBy.equals("car_km") || sortBy.equals("price") || sortBy.equals("model_year"));
    }

    private boolean isValidOrder(String order) {
        return order != null && (order.equals("asc") || order.equals("desc"));
    }
}
