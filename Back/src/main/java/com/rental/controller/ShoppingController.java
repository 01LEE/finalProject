package com.rental.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
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
import com.rental.service.UserService;
import com.rental.token.TokenProvider;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ShoppingController {

    private final TokenProvider tokenProvider;
    private final ProductService productService;
    private final UserService userService;

    @Autowired
    public ShoppingController(TokenProvider tokenProvider, ProductService productService, UserService userService) {
        this.tokenProvider = tokenProvider;
        this.productService = productService;
        this.userService = userService;
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
    
        String userId = tokenProvider.getUserIDFromToken(token);
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
            reviewDTO.setUserId(userId); // userId 설정
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
            System.out.println("Review: " + review); // userId를 포함한 리뷰 데이터를 확인
        }
        return ResponseEntity.ok(reviews);
    }

}
