package com.rental.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.rental.dto.ProductDTO;
import com.rental.dto.ReviewDTO;

@Mapper
public interface ProductMapper {

  List<ProductDTO> selectProducts(Map<String, Object> params);

  int insertReview(ReviewDTO reviewDTO);

  /**
   * 상품 이미지 경로 업데이트
   */
  void updateProductImage(
      @Param("productId") int productId,
      @Param("imagePath") String imagePath,
      @Param("detailImagePath") String detailImagePath);
}
