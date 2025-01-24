package com.rental.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rental.dto.UsedCarDTO;
import com.rental.service.UsedCarService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/used-cars")
@CrossOrigin(origins = "http://localhost:3000") // 컨트롤러 전체에 CORS 허용
public class UsedCarController {

    private final UsedCarService usedCarService;

    public UsedCarController(UsedCarService usedCarService) {
        this.usedCarService = usedCarService;
    }

    @GetMapping("/getAllUsedCars")
    public List<UsedCarDTO> getAllUsedCars(
            @RequestParam(required = false) String vehicleType,     // 차종
            @RequestParam(required = false) String brand,           // 제조사
            @RequestParam(required = false) Integer modelYear,      // 연식
            @RequestParam(required = false) Integer minPrice,       // 최소 가격
            @RequestParam(required = false) Integer maxPrice,       // 최대 가격
            @RequestParam(required = false) String color,           // 색상
            @RequestParam(required = false) String dealerLocation,  // 판매점
            @RequestParam(required = false) String fuelType,        // 연료
            @RequestParam(required = false) String transmission,    // 변속기
            @RequestParam(required = false) String driveType,       // 구동방식
            @RequestParam(required = false) Integer minKm,          // 최소 주행거리
            @RequestParam(required = false) Integer maxKm           // 최대 주행거리
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
                .collect(Collectors.toList());
    }
}