package com.rental.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.rental.token.TokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.dto.UserDTO;
import com.rental.service.MyPageService;
import com.rental.service.PasswordService;
import com.rental.service.UserService;

import io.jsonwebtoken.Claims;
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

        System.out.println("userInfo : " + userInfo);
        return ResponseEntity.ok(userInfo);

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

        /*
         * int count = mypageService.deleteUser(userId);
         * System.out.println("count : " + count);
         * if (count > 0) {
         * return ResponseEntity.ok("success");
         * }
         */

        return null;
    }

    @PostMapping("/updateProfile")
    public ResponseEntity<String> updateProfile(@CookieValue(value = "token", required = false) String token,
            @RequestBody String requestBody) {

        return null;
    }

}
