package com.rental.controller;

import com.rental.token.TokenProvider;
import io.jsonwebtoken.Claims;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MemberController {

    private final TokenProvider tokenProvider;

    public MemberController(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public Map<String, Object> generateToken(@RequestBody Map<String, String> map) {
        Map<String, Object> response = new HashMap<>();
        System.out.println("login...");
    
        String userId = map.get("id");
        String passWord = map.get("pwd");
        System.out.println("userId : " + userId + ", passWord : " + passWord);
    
        // 유효성 검사
        if (userId == null || passWord == null) {
            response.put("error", "Invalid input.");
            return response;
        }
    
        System.out.println("token 생성 중...");
        // 토큰 생성
        String token = tokenProvider.generateToken(userId, passWord);
    
        if (token != null) {
            response.put("token", token); // 토큰 반환
        } else {
            response.put("error", "Invalid user ID or password.");
        }
    
        return response;
    }
    

    
}
