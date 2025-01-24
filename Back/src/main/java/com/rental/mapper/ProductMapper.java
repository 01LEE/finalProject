package com.rental.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.rental.dto.ProductDTO;
import com.rental.dto.ReviewDTO;

@Mapper
public interface ProductMapper {
  List<ProductDTO> selectProducts(Map<String, Object> params);

  int insertReview(ReviewDTO reviewDTO);

  List<ReviewDTO> getReviewsByProductId(int productId);
}
