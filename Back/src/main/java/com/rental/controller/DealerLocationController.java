package com.rental.controller;

import com.rental.dto.UsedCarDTO;
import com.rental.mapper.DealerMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/dealer-locations")
@CrossOrigin(origins = "http://localhost:3000") // React와 CORS 연결
public class DealerLocationController {

    private final DealerMapper dealerRepository;  // CamelCase 적용

    // 생성자 주입
    public DealerLocationController(DealerMapper dealerRepository) {
        this.dealerRepository = dealerRepository;
    }

    // 중복 없는 딜러 지역 목록 가져오기
    @GetMapping
    public List<UsedCarDTO> getDealerLocations() {
        return this.dealerRepository.findDistinctDealerLocations();  // 인스턴스 메서드 호출로 변경
    }

   @GetMapping("/{location}")
    public List<UsedCarDTO> getCarsByLocation(@PathVariable String location) {
        return dealerRepository.findCarsByLocation(location);
    }
    
}
