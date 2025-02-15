package com.rental.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.rental.dto.ProductDTO;
import com.rental.dto.ProductDetailDTO;
import com.rental.dto.ReviewDTO;
import com.rental.dto.ShoppingPaymentDTO;
import com.rental.dto.ShoppingPaymentDetailDTO;

@Mapper
public interface ProductMapper {
  List<ProductDTO> selectProducts(Map<String, Object> params);

  int insertReview(ReviewDTO reviewDTO);

  List<ReviewDTO> getReviewsByProductId(int productId);

List<String> getAllProductImages();

void saveImagePath(Map<String, Object> params);

String getImagePathByProductId(int productId);

List<ProductDetailDTO> getProductDetailsByProductId(int productId);

 // 결제 번호 시퀀스 조회 (XML에서 처리)
  int getNextPaymentNo();

  // `shopping_payment` 저장
  void insertShoppingPayment(ShoppingPaymentDTO payment);

  // `shopping_payment_detail` 저장
  void insertShoppingPaymentDetail(ShoppingPaymentDetailDTO detail);
  
  Integer getProductStock(@Param("productId") int productId);

  void updateProductStock(@Param("productId") int productId, @Param("productCount") int productCount);

}
