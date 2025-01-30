package com.rental.service;

import com.rental.dto.UsedCarDTO;
import com.rental.mapper.UsedCarMapper;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UsedCarService {

    private final UsedCarMapper usedCarMapper;
    private final String uploadDir = "C:/uploads"; // 파일 저장 경로

    public UsedCarService(UsedCarMapper usedCarMapper) {
        this.usedCarMapper = usedCarMapper;
    }

    public List<UsedCarDTO> getAllUsedCars() {
        return usedCarMapper.getAllUsedCars();
    }

    public UsedCarDTO getCarByVehicleNo(String vehicleNo) {
        return usedCarMapper.findByVehicleNo(vehicleNo);
    }

    public String saveFile(MultipartFile file) {
        try {
            // 디렉토리가 없으면 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 고유한 파일 이름 생성
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // 파일 저장
            file.transferTo(filePath.toFile());

            // 저장된 파일의 경로 반환
            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패: " + e.getMessage(), e);
        }
    }

    public void updateCarDetails(String vehicleNo, String vehicleName, String brand, int modelYear, int price,
                                  String color, String fuelType, String transmission, String driveType,
                                  int seatingCapacity, String imageUrl, int carKm, String mainImage, String deletedImages) {

        // 삭제된 이미지 처리
        if (deletedImages != null && !deletedImages.isEmpty()) {
            List<String> deletedFilesList = Arrays.stream(deletedImages.split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
            deleteFiles(deletedFilesList); // 삭제된 이미지 파일 삭제
        }

        // DB 업데이트
        usedCarMapper.updateCarDetails(vehicleNo, vehicleName, brand, modelYear, price, color,
                fuelType, transmission, driveType, seatingCapacity, imageUrl, carKm, mainImage);
    }

    private void deleteFiles(List<String> filePaths) {
        for (String filePath : filePaths) {
            File file = new File(uploadDir + filePath.replace("/uploads/", "")); // 경로에서 '/uploads/' 제거
            if (file.exists() && file.isFile()) {
                if (file.delete()) {
                    System.out.println("파일 삭제 성공: " + filePath);
                } else {
                    System.err.println("파일 삭제 실패: " + filePath);
                }
            }
        }
    }

    /**
     * 🚀 필터링된 중고차 목록을 데이터베이스에서 직접 조회
     */
   
     public List<UsedCarDTO> getFilteredUsedCars(
        String vehicleName, String vehicleType, String brand, Integer modelYear, Integer minPrice, Integer maxPrice,
        String color, String dealerLocation, String fuelType, String transmission, String driveType,
        Integer minKm, Integer maxKm, Integer seatingCapacity, String sortBy, String order) {

    // ✅ 유효한 정렬 기준인지 확인
    List<String> validSortFields = Arrays.asList("car_km", "price", "model_year");
    if (sortBy == null || !validSortFields.contains(sortBy)) {
        sortBy = "car_km";  // 기본 정렬 기준 설정
    }

    // ✅ 정렬 순서 확인
    if (!"asc".equalsIgnoreCase(order) && !"desc".equalsIgnoreCase(order)) {
        order = "asc";  // 기본 오름차순 정렬
    }

    return usedCarMapper.getFilteredUsedCars(
            vehicleName, vehicleType, brand, modelYear, minPrice, maxPrice, color, dealerLocation,
            fuelType, transmission, driveType, minKm, maxKm, seatingCapacity, sortBy, order);
}
}