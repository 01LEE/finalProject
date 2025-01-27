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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/used-cars")
@CrossOrigin(origins = "http://localhost:3000") // 컨트롤러 전체에 CORS 허용
public class UsedCarController {

    private final UsedCarService usedCarService;

    // 이미지 저장 경로 (서버 로컬 또는 별도의 경로 설정)
    private static final String IMAGE_UPLOAD_DIR = "C:/car-images/";

    public UsedCarController(UsedCarService usedCarService) {
        this.usedCarService = usedCarService;
    }

    @GetMapping("/getAllUsedCars")
    public List<UsedCarDTO> getAllUsedCars(
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
        @RequestParam(required = false) String priceRange
    ) {
        List<UsedCarDTO> cars = usedCarService.getAllUsedCars();

        // 필터링 로직
        return cars.stream()
            .filter(car -> vehicleType == null || car.getVehicleType().equalsIgnoreCase(vehicleType))
            .filter(car -> brand == null || car.getBrand().equalsIgnoreCase(brand))
            .filter(car -> modelYear == null || car.getModelYear() == modelYear)
            .filter(car -> minPrice == null || car.getPrice() >= minPrice)
            .filter(car -> maxPrice == null || car.getPrice() <= maxPrice)
            .filter(car -> color == null || car.getColor().equalsIgnoreCase(color))
            .filter(car -> dealerLocation == null || car.getDealerLocation().equalsIgnoreCase(dealerLocation))
            .filter(car -> fuelType == null || car.getFuelType().equalsIgnoreCase(fuelType))
            .filter(car -> transmission == null || car.getTransmission().equalsIgnoreCase(transmission))
            .filter(car -> driveType == null || car.getDriveType().equalsIgnoreCase(driveType))
            .filter(car -> minKm == null || car.getCar_km() >= minKm)
            .filter(car -> maxKm == null || car.getCar_km() <= maxKm)
            .filter(car -> seatingCapacity == null || car.getSeatingCapacity() == seatingCapacity)
            .peek(car -> {
                // 대표 이미지 설정
                if (car.getUsedCarImage() != null && !car.getUsedCarImage().isEmpty()) {
                    car.setMainImage(car.getUsedCarImage().split(",")[0]);
                } else {
                    car.setMainImage("/default-image.png"); // 대표 이미지 없을 경우 기본 이미지 설정
                }
            })
            .collect(Collectors.toList());
    }

    @GetMapping("/detail")
    public UsedCarDTO getCarDetail(@RequestParam String vehicleNo) {
        UsedCarDTO carDTO = usedCarService.getCarByVehicleNo(vehicleNo);

        if (carDTO.getUsedCarImage() != null && !carDTO.getUsedCarImage().isEmpty()) {
            carDTO.setMainImage(carDTO.getUsedCarImage().split(",")[0]); // 대표 이미지 설정
        } else {
            carDTO.setMainImage("/default-image.png"); // 기본 이미지 설정
        }

        System.out.println("반환된 차량 데이터: " + carDTO); // 디버깅 로그
        return carDTO;
    }

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

            // mainImage 설정
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
                savedImages.isEmpty() ? carDTO.getUsedCarImage() : savedImages, // 새로 저장된 이미지 경로
                carDTO.getCar_km(),
                mainImage, // 대표 이미지
                carDTO.getDeletedImages() // 삭제된 이미지 리스트 전달
            );

            return ResponseEntity.ok("차량 정보 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 실패: " + e.getMessage());
        }
    }
}