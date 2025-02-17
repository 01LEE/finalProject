package com.rental.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.rental.dto.ProductDTO;
import com.rental.dto.ProductDetailDTO;
import com.rental.dto.ReviewDTO;
import com.rental.dto.ShoppingPaymentDTO;
import com.rental.dto.ShoppingPaymentDetailDTO;
import com.rental.mapper.MyPageMapper;
import com.rental.mapper.ProductMapper;

@Service
public class ProductService {

  private final ProductMapper mapper;
  private final MyPageMapper mypageMapper;

  @Autowired
	public ProductService(ProductMapper mapper, MyPageMapper mypageMapper) {
		this.mapper = mapper;
    this.mypageMapper = mypageMapper;
	}

	public List<ProductDTO> selectProducts(Map<String, Object> params) {
        return mapper.selectProducts(params);
    }

    public int addReview(ReviewDTO reviewDTO) {
      return mapper.insertReview(reviewDTO);
  }

    public List<ReviewDTO> getReviewsByProductId(int productId) {
        return mapper.getReviewsByProductId(productId);
    }

    public List<String> getAllProductImages() {
      return mapper.getAllProductImages();
    }

    public void saveImagePath(int productId, String productImage) {
      Map<String, Object> params = Map.of(
          "productId", productId,
          "productImage", productImage
      );
      mapper.saveImagePath(params);
  }

   public String getBase64Image(int productId) throws Exception {
        String imagePath = mapper.getImagePathByProductId(productId);
        if (imagePath == null) {
            throw new Exception("이미지 경로를 찾을 수 없습니다.");
        }

        Path path = Paths.get("src/main/resources/static" + imagePath);
        byte[] imageBytes = Files.readAllBytes(path);
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }


    public String uploadImage(int productId, MultipartFile file) throws Exception {
      String uploadDir = "src/main/resources/static/images";
      File directory = new File(uploadDir);
      if (!directory.exists()) {
          directory.mkdirs();
      }

      String filePath = uploadDir + "/" + file.getOriginalFilename();
      file.transferTo(new File(filePath));

      String dbPath = "/images/" + file.getOriginalFilename();
      saveImagePath(productId, dbPath);

      return dbPath;
  }

  public List<ProductDetailDTO> getProductDetailsByProductId(int productId) {
    List<ProductDetailDTO> details = mapper.getProductDetailsByProductId(productId);
    System.out.println("📦 반환할 데이터: " + details); // 로그 추가
    return details;
  }

   @Transactional
  public int processPayment(int userNo, List<ShoppingPaymentDetailDTO> cartItems) {
      // ✅ 1️⃣ 사용자 현재 포인트 조회 (mypageMapper 사용)
      int userPoint = mypageMapper.getUserPoint(userNo);
      System.out.println("📌 현재 사용자 포인트: " + userPoint); // ✅ 현재 포인트 확인용 로그
  
      int totalPrice = cartItems.stream().mapToInt(item -> item.getProductAllPrice()).sum();
      System.out.println("📌 결제 총 금액: " + totalPrice); // ✅ 총 결제 금액 확인용 로그
  
      if (userPoint < totalPrice) {
          throw new IllegalStateException("❌ 보유 포인트가 부족합니다!");
      }
  
      // ✅ 2️⃣ 결제번호 생성
      int paymentNo = mapper.getNextPaymentNo();
      System.out.println("✅ 생성된 paymentNo: " + paymentNo); // ✅ 결제번호 확인 로그
  
      // ✅ 3️⃣ `shopping_payment` 테이블에 저장
      ShoppingPaymentDTO payment = new ShoppingPaymentDTO();
      payment.setPaymentNo(paymentNo);
      payment.setUserNo(userNo);
      mapper.insertShoppingPayment(payment);
  
      // ✅ 4️⃣ `shopping_payment_detail` 저장
      for (ShoppingPaymentDetailDTO item : cartItems) {
          item.setUserNo(userNo);
          item.setPaymentNo(paymentNo);
          item.setPaymentDate(new Timestamp(System.currentTimeMillis()));
  
          mapper.insertShoppingPaymentDetail(item);
      }
  
      // ✅ 5️⃣ 사용자 포인트 차감 (mypageMapper 사용)
      int newPoint = userPoint - totalPrice;
      mypageMapper.updateUserPoint(userNo, newPoint);
      System.out.println("✅ 차감 후 사용자 포인트: " + newPoint); // ✅ 차감된 포인트 확인 로그
  
      return paymentNo;
  }

   // ✅ 추가: 재고 확인
   public boolean checkStockAvailability(int productId, int productCount) {
    Integer stock = mapper.getProductStock(productId);
    return stock != null && stock >= productCount;
}

public void updateProductStock(int productId, int productCount) {
    mapper.updateProductStock(productId, productCount);
}
}
