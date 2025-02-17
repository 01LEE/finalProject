package com.rental.controller;

import java.io.File;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rental.token.TokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.dto.UserDTO;
import com.rental.service.MyPageService;
import com.rental.service.PasswordService;
import com.rental.service.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true", exposedHeaders = {
        "user-role" })
public class MyPageCotroller {

    private final TokenProvider tokenProvider;
    private final MyPageService mypageService;
    private final PasswordService passwordService;
    private final UserService userService;

    public MyPageCotroller(TokenProvider tokenProvider, MyPageService mypageService, PasswordService passwordService,
            UserService userService) {
        this.tokenProvider = tokenProvider;
        this.mypageService = mypageService;
        this.passwordService = passwordService;
        this.userService = userService;
    }

    @GetMapping("/mypage")
    public ResponseEntity<?> findUser(@CookieValue(value = "token", required = false) String token) {
        System.out.println("paymentUser token : " + token);

        if (token == null || !tokenProvider.isValidToken(token)) {
            return ResponseEntity.badRequest().body("로그인이 필요합니다.");
        }

        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("userId", String.class);
        System.out.println("paymentUser userId : " + userId);

        UserDTO userInfo = mypageService.getUserInfo(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("userInfo", userInfo);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth")
    public ResponseEntity<String> login(@CookieValue(value = "token", required = false) String token,
            @RequestBody String requestBody) {

        if (token == null || !tokenProvider.isValidToken(token)) {
            return ResponseEntity.badRequest().body("로그인이 필요합니다.");
        }

        String password = "";
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> jsonMap = objectMapper.readValue(requestBody, Map.class);
            password = jsonMap.get("password").trim();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("잘못된 요청 형식입니다.");
        }

        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("userId", String.class);
        System.out.println("auth userId : " + userId);
        if (userId == null) {
            return ResponseEntity.badRequest().body("로그인이 필요합니다.");
        }

        System.out.println("findById result: " + userId);

        UserDTO userPassword = userService.selectPassword(userId);
        System.out.println("user : " + userPassword);

        boolean passwordMatch = passwordService.verifyPassword(password, userPassword.getPassword());
        System.out.println("Password verification: " + passwordMatch);

        if (!passwordMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 잘못되었습니다.");
        }

        return ResponseEntity.ok("success");
    }

    @PostMapping("/checkKakao")
    public ResponseEntity<String> checkKakao(@CookieValue(value = "token", required = false) String token) {

        if (token == null || !tokenProvider.isValidToken(token)) {
            return ResponseEntity.badRequest().body("로그인이 필요합니다.");
        }

        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("userId", String.class);
        System.out.println("checkKakao userId : " + userId);

        int count = mypageService.checkKakao(userId);
        System.out.println("count : " + count);
        if (count > 0) {
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.ok("fail");
    }

    @PostMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@CookieValue(value = "token", required = false) String token) {

        if (token == null || !tokenProvider.isValidToken(token)) {
            return ResponseEntity.badRequest().body("로그인이 필요합니다.");
        }

        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("userId", String.class);
        System.out.println("deleteUser userId : " + userId);

        int count = mypageService.deleteUser(userId);
        System.out.println("count : " + count);
        if (count > 0) {
            return ResponseEntity.ok("success");
        }

        return null;
    }

    @PostMapping("/updateProfile")
    public ResponseEntity<String> updateProfile(
            @CookieValue(value = "token", required = false) String token,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestParam Map<String, String> request) {

        if (token == null || !tokenProvider.isValidToken(token)) {
            return ResponseEntity.badRequest().body("로그인이 필요합니다.");
        }

        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("userId", String.class);
        System.out.println("updateProfile userId : " + userId);

        // 텍스트 데이터 출력
        System.out.println("요청 데이터: " + request);

        // 파일 처리
        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                // 파일을 Base64로 인코딩
                byte[] imageBytes = profileImage.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);

                // Base64 인코딩된 이미지 데이터를 request에 추가
                request.put("profileImage", base64Image);

                System.out.println("Base64 변환된 이미지: " + base64Image.substring(0, 50) + "...");
            } else {
                System.out.println("프로필 이미지 없음");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("파일 처리 중 오류 발생: " + e.getMessage());
        }

        System.out.println("request : " + request);

        int count = mypageService.updateProfile(userId, request);

        return null;
    }
}