package com.rental.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.dto.UsedCarDTO;
import com.rental.dto.UsedCarImageDTO;
import com.rental.dto.UsedCarPaymentDTO; // 사용자가 정의한 결제 DTO (예시)
import com.rental.dto.UserDTO;
import com.rental.mapper.MyPageMapper;
import com.rental.service.UsedCarService;
import com.rental.service.UserService;
import com.rental.token.TokenProvider;
import com.rental.mapper.MyPageMapper;
import io.jsonwebtoken.Claims;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/used-cars")
@CrossOrigin(origins = "http://localhost:3000") // CORS 허용
public class UsedCarController {

    private final UsedCarService usedCarService;
    // 토큰 검증 및 사용자 정보 획득을 위한 의존성 (구현에 맞게 변경)
    private final TokenProvider tokenProvider;
    private final UserService userService;
    private final MyPageMapper mypageMapper;
    private static final String IMAGE_UPLOAD_DIR = "C:/car-images/";
    private static final String DEFAULT_IMAGE_URL = "/images/usedcar_imageX.png";

    public UsedCarController(UsedCarService usedCarService,
            TokenProvider tokenProvider,
            UserService userService, MyPageMapper mypageMapper) {
        this.usedCarService = usedCarService;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
        this.mypageMapper = mypageMapper;
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
                deletedImages = objectMapper.readValue(deletedImagesJson, new TypeReference<List<String>>() {
                });
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
                    carDTO.getMainImage(),
                    carDTO.getDescription());
                    

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

    // 🚗 중고차 결제 엔드포인트 추가 (사용자 정의 DTO를 받아 결제 처리)
    @PostMapping("/payment")
    public ResponseEntity<Map<String, Object>> processCarPayment(
            @CookieValue(value = "token", required = false) String token,
            @RequestBody UsedCarPaymentDTO paymentDTO) {
    
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "토큰이 포함되지 않았습니다."));
        }
        if (!tokenProvider.isValidToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "토큰이 유효하지 않습니다."));
        }
    
        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("userId", String.class);
        Integer userNo = userService.getUserNoByUserId(userId);
    
        if (userNo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "존재하지 않는 사용자입니다."));
        }
    
        try {
            int paymentNo = usedCarService.processCarPayment(userNo, paymentDTO);
    
            // 결제 완료 후 소프트 딜리트 수행 (예: 해당 차량 게시물 삭제)
            // paymentDTO에 차량번호가 포함되어 있어야 합니다.
            usedCarService.softDeleteUsedCar(paymentDTO.getVehicleNo());
    
            Map<String, Object> response = new HashMap<>();
            response.put("paymentNo", paymentNo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "결제 처리 중 오류 발생: " + e.getMessage()));
        }

        
    }
    @GetMapping("/point")
    public ResponseEntity<Map<String, Object>> getUserPoint(
            @RequestParam int userNo) {  // userId 대신 userNo 사용
        try {
            int point = mypageMapper.getUserPoint(userNo);  // 메서드명과 파라미터 타입 일치
            Map<String, Object> response = new HashMap<>();
            response.put("userPoint", point);
            System.out.println("point : " + point);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "포인트 조회 중 오류 발생: " + e.getMessage()));
        }
    }
    @GetMapping("/user/info")
public ResponseEntity<?> getUserInfo(@CookieValue(value = "token", required = false) String token) {
    if (token == null || !tokenProvider.isValidToken(token)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", "토큰이 유효하지 않습니다."));
    }
    Claims claims = tokenProvider.getClaims(token);
    String userId = claims.get("userId", String.class);
    UserDTO user = userService.findById(userId);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("error", "사용자 정보를 찾을 수 없습니다."));
    }
    return ResponseEntity.ok(user);
}
}
