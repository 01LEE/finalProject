package com.rental.mapper;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.rental.dto.UsedCarDTO;
@Mapper
public interface DealerMapper {
 // 중복 없는 지역 목록 가져오기
 List<UsedCarDTO> findDistinctDealerLocations();

List<UsedCarDTO> findCarsByLocation(String location);
}
