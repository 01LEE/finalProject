package com.rental.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rental.dto.ProductDTO;
import com.rental.dto.ProductDetailDTO;
import com.rental.dto.ReviewDTO;
import com.rental.dto.ShoppingPaymentDetailDTO;
import com.rental.service.MyPageService;
import com.rental.service.ProductService;
import com.rental.service.UserService;
import com.rental.token.TokenProvider;

import io.jsonwebtoken.Claims;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ShoppingController {

    private final TokenProvider tokenProvider;
    private final ProductService productService;
    private final UserService userService;
    private final MyPageService mypageService;

    @Autowired
    public ShoppingController(TokenProvider tokenProvider, ProductService productService, UserService userService,
            MyPageService mypageService) {
        this.tokenProvider = tokenProvider;
        this.productService = productService;
        this.userService = userService;
        this.mypageService = mypageService;
    }

    @GetMapping("/shopping")
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(required = false) String categoryMain,
            @RequestParam(required = false) String categorySub,
            @RequestParam(required = false) String categoryDetail) {
        System.out.println("categoryMain: " + categoryMain);
        System.out.println("categorySub: " + categorySub);
        System.out.println("categoryDetail: " + categoryDetail);

        Map<String, Object> params = new HashMap<>();
        params.put("categoryMain", categoryMain);
        params.put("categorySub", categorySub);
        params.put("categoryDetail", categoryDetail);

        List<ProductDTO> products = productService.selectProducts(params);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/shopping/product/{productId}/review")
    public ResponseEntity<Map<String, Object>> addReview(
            @PathVariable int productId,
            @RequestBody ReviewDTO reviewDTO,
            @CookieValue(value = "token", required = false) String token) {
        Map<String, Object> response = new HashMap<>();

        if (token == null || !tokenProvider.isValidToken(token)) {
            response.put("code", 2);
            response.put("msg", "유효하지 않은 토큰입니다. 로그인이 필요합니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 토큰에서 클레임 추출
        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("userId", String.class);

        if (userId == null) {
            response.put("code", 3);
            response.put("msg", "토큰에서 사용자 정보를 추출할 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        Integer userNo = userService.getUserNoByUserId(userId);
        if (userNo == null) {
            response.put("code", 4);
            response.put("msg", "존재하지 않는 사용자입니다.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            reviewDTO.setProductId(productId);
            reviewDTO.setUserNo(userNo);
            reviewDTO.setUserId(userId);
            productService.addReview(reviewDTO);

            response.put("code", 1);
            response.put("msg", "리뷰가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            response.put("code", 5);
            response.put("msg", "리뷰 추가 중 오류가 발생했습니다.");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/shopping/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviews(@PathVariable int productId) {
        List<ReviewDTO> reviews = productService.getReviewsByProductId(productId);
        for (ReviewDTO review : reviews) {
            System.out.println("Review: " + review);
        }
        return ResponseEntity.ok(reviews);
    }

    // 이미지 업로드 (서비스 메서드 사용)
    @PostMapping("/shopping/product/{productId}/uploadImage")
    public ResponseEntity<String> uploadProductImage(@PathVariable int productId,
            @RequestParam("file") MultipartFile file) {
        try {
            String dbPath = productService.uploadImage(productId, file);
            return ResponseEntity.ok(dbPath);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("이미지 업로드에 실패했습니다.");
        }
    }

    // 이미지 가져오기 (서비스 메서드 사용)
    @GetMapping("/shopping/product/{productId}/getImage")
    public ResponseEntity<String> getProductImage(@PathVariable int productId) {
        try {
            String base64Image = productService.getBase64Image(productId);
            return ResponseEntity.ok(base64Image);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("이미지를 가져오는 데 실패했습니다.");
        }
    }

    // 전체 이미지 가져오기
    @GetMapping("/shopping/product/images")
    public ResponseEntity<List<String>> getAllProductImages() {
        try {
            List<String> images = productService.getAllProductImages();
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // 이미지 경로 저장
    @PostMapping("/shopping/product/{productId}/saveImagePath")
    public ResponseEntity<String> saveImagePath(@PathVariable int productId, @RequestParam("path") String imagePath) {
        try {
            productService.saveImagePath(productId, imagePath);
            return ResponseEntity.ok("이미지 경로 저장 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("이미지 경로 저장 실패");
        }
    }

    // ✅ 특정 제품의 상세 정보 가져오기 (product + product_detail)
    @GetMapping("/shopping/product/{productId}/details")
    public List<ProductDetailDTO> getProductDetails(@PathVariable int productId) {
        System.out.println("🔍 요청받음: /shopping/product/" + productId + "/details"); // ✅ 로그 추가
        return productService.getProductDetailsByProductId(productId);
    }

    @PostMapping("/shopping/payment")
    public ResponseEntity<Map<String, Object>> processPayment(
            @CookieValue(value = "token", required = false) String token,
            @RequestBody List<ShoppingPaymentDetailDTO> cartItems) {

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "토큰이 포함되지 않았습니다."));
        }
        if (!tokenProvider.isValidToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "토큰이 유효하지 않습니다."));
        }

        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("userId", String.class);
        Integer userNo = userService.getUserNoByUserId(userId);

        if (userNo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "존재하지 않는 사용자입니다."));
        }

        if (cartItems == null || cartItems.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "결제 항목이 비어 있습니다."));
        }

        try {
            // ✅ 기존 결제 처리 로직
            int paymentNo = productService.processPayment(userNo, cartItems);
            System.out.println("✅ 결제 처리 완료");

            // ✅ 추가: 재고 감소 처리
            for (ShoppingPaymentDetailDTO item : cartItems) {
                boolean isStockAvailable = productService.checkStockAvailability(item.getProductId(),
                        item.getProductCount());
                if (!isStockAvailable) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Collections.singletonMap("error", "상품 재고가 부족합니다."));
                }
                productService.updateProductStock(item.getProductId(), item.getProductCount());
            }
            System.out.println("✅ 재고 감소 완료");

            // ✅ JSON 형식으로 명확하게 반환
            Map<String, Object> response = new HashMap<>();
            response.put("paymentNo", paymentNo);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "결제 처리 중 오류 발생: " + e.getMessage()));
        }
    }

}
