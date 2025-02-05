package com.rental.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.rental.dto.ProductDTO;
import com.rental.dto.ProductDetailDTO;
import com.rental.dto.ReviewDTO;
import com.rental.mapper.ProductMapper;

@Service
public class ProductService {

  private final ProductMapper mapper;

  @Autowired
	public ProductService(ProductMapper mapper) {
		this.mapper = mapper;
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
}
