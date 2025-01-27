package com.rental.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.rental.dto.UsedCarDTO;

@Mapper
public interface UsedCarMapper {

    // 모든 중고차 데이터를 가져오는 메서드
    List<UsedCarDTO> getAllUsedCars();

    // 차량 번호를 기준으로 특정 차량 데이터를 가져오는 메서드
    UsedCarDTO findByVehicleNo(@Param("vehicleNo") String vehicleNo);

    // 차량 세부 정보를 업데이트하는 메서드
    void updateCarDetails(
            @Param("vehicleNo") String vehicleNo,
            @Param("vehicleName") String vehicleName,
            @Param("brand") String brand,
            @Param("modelYear") int modelYear,
            @Param("price") int price,
            @Param("color") String color,
            @Param("fuelType") String fuelType,
            @Param("transmission") String transmission,
            @Param("driveType") String driveType,
            @Param("seatingCapacity") int seatingCapacity,
            @Param("imageUrl") String imageUrl,
            @Param("carKm") int carKm,
            @Param("mainImage") String mainImage // 추가된 대표 이미지 매개변수
    );
}
