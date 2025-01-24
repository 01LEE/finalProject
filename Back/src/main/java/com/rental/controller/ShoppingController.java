package com.rental.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rental.dto.ProductDTO;
import com.rental.dto.ReviewDTO;
import com.rental.service.ProductService;
import com.rental.token.TokenProvider;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ShoppingController {

    private final TokenProvider tokenProvider;
    private final ProductService productService;

    @Autowired
    public ShoppingController(TokenProvider tokenProvider, ProductService productService) {
        this.tokenProvider = tokenProvider;
        this.productService = productService;
    }

    /**
     * 상품 목록 조회
     */
    @GetMapping("/shopping")
    public ResponseEntity<List<ProductDTO>> getProducts(
        @RequestParam(required = false) String categoryMain,
        @RequestParam(required = false) String categorySub,
        @RequestParam(required = false) String categoryDetail
    ) {
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

    /**
     * 리뷰 추가
     */
    @PostMapping("/product/{productId}/review")
    public ResponseEntity<Map<String, Object>> addReview(
            @PathVariable int productId,
            @RequestBody ReviewDTO reviewDTO,
            @RequestHeader("Authorization") String token) {

        Map<String, Object> response = new HashMap<>();

        // 토큰 유효성 검증
        token = token != null ? token.replace("Bearer ", "") : null;
        if (token == null || !tokenProvider.isValidToken(token)) {
            response.put("code", 2);
            response.put("msg", "유효하지 않은 토큰입니다. 로그인이 필요합니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 토큰에서 사용자 ID 추출
        String userId = tokenProvider.getUserIDFromToken(token);
        if (userId == null) {
            response.put("code", 3);
            response.put("msg", "토큰에서 사용자 정보를 추출할 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 리뷰 생성 및 저장
        try {
            reviewDTO.setProductId(productId);
            reviewDTO.setUserNo(Integer.parseInt(userId)); // userId를 정수형으로 변환
            productService.addReview(reviewDTO); // 리뷰 추가

            // 성공 응답
            response.put("code", 1);
            response.put("msg", "리뷰가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            response.put("code", 4);
            response.put("msg", "리뷰 추가 중 오류가 발생했습니다.");
        }

        return ResponseEntity.ok(response);
    }

   
}
