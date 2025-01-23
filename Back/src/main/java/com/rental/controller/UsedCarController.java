package com.rental.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rental.dto.UsedCarDTO;
import com.rental.service.UsedCarService;

import java.util.List;

@RestController
@RequestMapping("/used-cars")
@CrossOrigin(origins = "http://localhost:3000") // 컨트롤러 전체에 CORS 허용
public class UsedCarController {

    private final UsedCarService usedCarService;

    public UsedCarController(UsedCarService usedCarService) {
        this.usedCarService = usedCarService;
    }

    @GetMapping("/getAllUsedCars")
    public List<UsedCarDTO> getAllUsedCars() {
        List<UsedCarDTO> cars = usedCarService.getAllUsedCars();
      
        return usedCarService.getAllUsedCars();
    }
}