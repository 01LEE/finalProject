package com.rental.service;

import com.rental.dto.UsedCarDTO;
import com.rental.dto.UsedCarImageDTO;
import com.rental.mapper.UsedCarMapper;
import com.rental.mapper.UsedCarImageMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsedCarService {

    private final UsedCarMapper usedCarMapper;
    private final UsedCarImageMapper usedCarImageMapper;
    private static final String DEFAULT_IMAGE_URL = "/images/usedcar_imageX.png";

    public UsedCarService(UsedCarMapper usedCarMapper, UsedCarImageMapper usedCarImageMapper) {
        this.usedCarMapper = usedCarMapper;
        this.usedCarImageMapper = usedCarImageMapper;
    }

    // 전체 중고차 조회
    public List<UsedCarDTO> getAllUsedCars() {
        return usedCarMapper.getAllUsedCars();
    }

    // 차량 상세 조회 (이미지 포함)
    public UsedCarDTO getCarByVehicleNo(String vehicleNo) {
        UsedCarDTO car = usedCarMapper.findByVehicleNo(vehicleNo);
        if (car != null) {
            car.setUsedCarImages(usedCarImageMapper.getImagesByVehicleNo(vehicleNo));
        }
        return car;
    }

    // 차량 정보 수정 (이미지는 개별적으로 추가/삭제)
    public void updateCarDetails(String vehicleNo, String vehicleName, String brand, int modelYear, int price,
                                 String color, String fuelType, String transmission, String driveType,
                                 int seatingCapacity, int carKm, String mainImage) {
        usedCarMapper.updateCarDetails(
            vehicleNo, vehicleName, brand, modelYear, price, color,
            fuelType, transmission, driveType, seatingCapacity, carKm
        );

        // 차량의 대표 이미지를 업데이트
        usedCarMapper.updateMainImage(vehicleNo, mainImage);
    }

    // 삭제된 이미지 처리
    @Transactional
    public void deleteUsedCarImages(List<String> deletedImages, String vehicleNo) {
        if (deletedImages != null && !deletedImages.isEmpty()) {
            for (String imageUrl : deletedImages) {
                System.out.println("🛠️ 삭제 요청 이미지: " + imageUrl);
                usedCarImageMapper.deleteImageByUrl(imageUrl);
            }
        }
    }

    // 새로운 이미지 추가 (개별적으로 DB에 INSERT)
    public void addUsedCarImage(UsedCarImageDTO newImageDTO) {
        usedCarImageMapper.insertUsedCarImage(newImageDTO);
    }

    // 필터링된 중고차 목록 조회
    public List<UsedCarDTO> getFilteredUsedCars(
        String vehicleName, String vehicleType, String brand, Integer modelYear, Integer minPrice, Integer maxPrice,
        String color, String dealerLocation, String fuelType, String transmission, String driveType,
        Integer minKm, Integer maxKm, Integer seatingCapacity, String sortBy, String order) {

        if (sortBy == null || (!sortBy.equals("car_km") && !sortBy.equals("price") && !sortBy.equals("model_year"))) {
            sortBy = "car_km";
        }

        if (!"asc".equalsIgnoreCase(order) && !"desc".equalsIgnoreCase(order)) {
            order = "asc";
        }

        return usedCarMapper.getFilteredUsedCars(
            vehicleName, vehicleType, brand, modelYear, minPrice, maxPrice, color, dealerLocation,
            fuelType, transmission, driveType, minKm, maxKm, seatingCapacity, sortBy, order
        );
    }

    // 대표 이미지 상태 업데이트 (vehicleNo 기준)
    @Transactional
    public void updateMainImageStatus(String vehicleNo, String status) {
        usedCarImageMapper.updateMainImageStatusByVehicleNo(vehicleNo, "N");
        usedCarImageMapper.updateMainImageStatusByVehicleNo(vehicleNo, status);
    }

    // 대표 이미지 상태 업데이트 (imageId 기준)
    @Transactional
    public void updateMainImageStatusById(Long imageId, String status) {
        usedCarImageMapper.updateMainImageStatusById(imageId, status);
    }

    // 이미지 ID로 사용된 이미지 가져오기
    public UsedCarImageDTO getUsedCarImageById(Long mainImageId) {
        return usedCarImageMapper.getImageById(mainImageId);
    }

    @Transactional
    public void deleteUsedCar(String vehicleNo) {
        System.out.println("🛠 삭제 요청 vehicleNo: " + vehicleNo);
        try {
            usedCarImageMapper.deleteImagesByVehicleNo(vehicleNo);
            System.out.println("✅ 이미지 삭제 완료");
            usedCarMapper.clearMainImage(vehicleNo);
            System.out.println("✅ MAIN_IMAGE 필드 초기화 완료");
            usedCarMapper.deleteUsedCar(vehicleNo);
            System.out.println("✅ 차량 삭제 완료");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("🚨 차량 삭제 중 오류 발생: " + e.getMessage());
        }
    }

    // 차량 등록 (INSERT) API 구현
    @Transactional
    public void addCarDetails(UsedCarDTO usedCarDTO, List<UsedCarImageDTO> imageDTOList) {
        // 1. UsedCar 테이블에 차량 기본 정보 INSERT
        usedCarMapper.insertUsedCar(usedCarDTO);
        // MyBatis 설정에 따라 usedCarDTO에 자동 생성된 vehicleNo가 주입되었다고 가정합니다.
        String vehicleNo = usedCarDTO.getVehicleNo();
    
        // 2. 대표 이미지가 지정되지 않은 경우, 이미지 목록이 있다면 첫 번째 이미지 URL을 대표 이미지로 설정
        if (usedCarDTO.getMainImage() == null || usedCarDTO.getMainImage().isEmpty()) {
            if (imageDTOList != null && !imageDTOList.isEmpty()) {
                usedCarDTO.setMainImage(imageDTOList.get(0).getImageUrl());
            } else {
                usedCarDTO.setMainImage(DEFAULT_IMAGE_URL);
            }
            usedCarMapper.updateMainImage(vehicleNo, usedCarDTO.getMainImage());
        }
    
        // 3. 각 추가 이미지에 대해 차량 번호를 설정 후, Used_CarImage 테이블에 INSERT
        if (imageDTOList != null && !imageDTOList.isEmpty()) {
            for (UsedCarImageDTO imageDTO : imageDTOList) {
                imageDTO.setVehicleNo(vehicleNo);
                usedCarImageMapper.insertUsedCarImage(imageDTO);
            }
        }
    }
}
