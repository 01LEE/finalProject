package com.rental.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.rental.dto.UsedCarDTO;
import com.rental.dto.UsedCarPaymentDTO;
import com.rental.dto.UsedCarpaymentDetailDTO;

@Mapper
public interface UsedCarMapper {

    // 모든 중고차 데이터 조회
    List<UsedCarDTO> getAllUsedCars();

    // 차량 번호로 특정 차량 조회
    UsedCarDTO findByVehicleNo(@Param("vehicleNo") String vehicleNo);

    // 차량 정보 업데이트 (mainImage 제외)
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
            @Param("carKm") int carKm,
            @Param("description") String description);

    // 필터링된 중고차 조회 (정렬 기능 포함)
    List<UsedCarDTO> getFilteredUsedCars(
            @Param("vehicleName") String vehicleName,
            @Param("vehicleType") String vehicleType,
            @Param("brand") String brand,
            @Param("modelYear") Integer modelYear,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("color") String color,
            @Param("dealerLocation") String dealerLocation,
            @Param("fuelType") String fuelType,
            @Param("transmission") String transmission,
            @Param("driveType") String driveType,
            @Param("minKm") Integer minKm,
            @Param("maxKm") Integer maxKm,
            @Param("seatingCapacity") Integer seatingCapacity,
            @Param("sortBy") String sortBy,
            @Param("order") String order);

    void updateMainImage(String vehicleNo, String mainImage);

    void deleteUsedCar(@Param("vehicleNo") String vehicleNo);

    void clearMainImage(String vehicleNo);

    void insertUsedCar(UsedCarDTO usedCarDTO);

    int getNextPaymentNo();

    void insertUsedCarPayment(UsedCarPaymentDTO paymentRecord);

    void insertUsedCarPaymentDetail(UsedCarpaymentDetailDTO detailRecord);

    void softDeleteUsedCar(String vehicleNo);

}
