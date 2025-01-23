package com.rental.service;

import com.rental.dto.UsedCarDTO;
import com.rental.mapper.UsedCarMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsedCarService {

    private final UsedCarMapper usedCarMapper;

    public UsedCarService(UsedCarMapper usedCarMapper) {
        this.usedCarMapper = usedCarMapper;
    }

    public List<UsedCarDTO> getAllUsedCars() {
        List<UsedCarDTO> cars = usedCarMapper.getAllUsedCars();
        return cars;
    }
}