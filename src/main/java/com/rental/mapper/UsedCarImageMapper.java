package com.rental.mapper;

import com.rental.dto.UsedCarImageDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UsedCarImageMapper {
    
    List<UsedCarImageDTO> getImagesByVehicleNo(@Param("vehicleNo") String vehicleNo);
    
    void insertUsedCarImage(UsedCarImageDTO newImageDTO);
    
    void deleteImageByUrl(@Param("imageUrl") String imageUrl);

    void updateMainImageStatusByVehicleNo(String vehicleNo, String status);
    
    void updateMainImageStatusById(Long imageId, String status);
    
    UsedCarImageDTO getImageById(Long mainImageId);

    // 🚀 신규 추가: 차량 번호 기반 이미지 삭제 기능

    void deleteImagesByVehicleNo(@Param("vehicleNo") String vehicleNo);
}
