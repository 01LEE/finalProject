package com.rental.controller;

import com.rental.token.TokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class UserController {

    private final TokenProvider tokenProvider;

    public UserController(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> map, HttpServletResponse response) {
        System.out.println("login...");

        String userId = map.get("id");
        String passWord = map.get("pwd");
        System.out.println("userId : " + userId + ", passWord : " + passWord);

        // 유효성 검사
        if (userId == null || passWord == null) {
            return ResponseEntity.badRequest().body("아이디와 비밀번호를 입력하세요.");
        }

        System.out.println("token 생성 중...");
        // 토큰 생성
        String token = tokenProvider.generateToken(userId, passWord);

        if (token != null) {
            // 쿠키 설정
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // HTTPS 환경에서만 전송
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60); // 1시간

            response.addCookie(cookie);

            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 잘못되었습니다.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 쿠키 즉시 삭제

        response.addCookie(cookie);
        return ResponseEntity.ok("로그아웃 성공");
    }

}
