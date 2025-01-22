package com.rental.token;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

@Component
public class TokenProvider {

    private final long expiredTime = 1000L * 60L * 60L; // 1시간
    private final SecretKey key = Keys
            .hmacShaKeyFor("ThisIsA256BitSecretKeyForJWTGeneration!".getBytes(StandardCharsets.UTF_8));

    public String generateToken(String userId, String passWord) {
        Date expire = new Date(System.currentTimeMillis() + expiredTime);
        System.out.println("userId : " + userId);
        System.out.println("passWord : " + passWord);

        if (userId.trim().equals("gustjd11")) {
            return Jwts.builder()
                    .setHeader(createHeader())
                    .setClaims(createClaims(userId, passWord))
                    .setSubject(userId)
                    .setExpiration(expire)
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();
        } else {
            System.out.println("존재하지 않는 아이디 입니다.");
        }
        return null;
    }

    private Map<String, Object> createHeader() {
        Map<String, Object> header = new HashMap<>();
        header.put("typ", "JWT");
        header.put("alg", "HS256");
        return header;
    }

    private Map<String, Object> createClaims(String userId, String passWord) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("passWord", passWord);

        // role 설정
        if ("gustjd11".equals(userId.trim())) {
            claims.put("role", "admin");
        } else {
            claims.put("role", "user");
        }

        System.out.println("role : " + claims.get("role"));
        return claims;
    }

    public Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key) // 서명 키 설정
                    .build()
                    .parseClaimsJws(token) // 토큰 검증 및 디코딩
                    .getBody(); // Claims 반환
        } catch (Exception e) {
            throw new RuntimeException("토큰 검증 실패: " + e.getMessage());
        }
    }
}
