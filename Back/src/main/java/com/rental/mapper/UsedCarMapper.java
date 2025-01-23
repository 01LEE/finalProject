package com.rental.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.rental.dto.UsedCarDTO;

@Mapper
public interface UsedCarMapper {

    List<UsedCarDTO> getAllUsedCars();

}
