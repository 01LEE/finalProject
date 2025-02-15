package com.rental.token;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;

import com.rental.dto.UserDTO;
import com.rental.service.UserService;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TokenProvider {

    private final long expiredTime = 1000L * 60L * 60L; // 1시간
    private final SecretKey key = Keys
            .hmacShaKeyFor("ThisIsA256BitSecretKeyForJWTGeneration!".getBytes(StandardCharsets.UTF_8));

    // JWT 생성
    public String generateToken(String userId, String role) {
        Date expire = new Date(System.currentTimeMillis() + expiredTime);

        return Jwts.builder()
                .setHeader(createHeader())
                .setClaims(createClaims(userId, role))
                .setSubject(userId)
                .setExpiration(expire)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT 헤더 생성
    private Map<String, Object> createHeader() {
        Map<String, Object> header = new HashMap<>();
        header.put("typ", "JWT");
        header.put("alg", "HS256");
        return header;
    }

    // JWT 클레임 생성
    private Map<String, Object> createClaims(String userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        return claims;
    }

    // JWT 검증
    public boolean isValidToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.err.println("토큰 검증 실패: " + e.getMessage());
            return false;
        }
    }

    // JWT에서 클레임 추출
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUserId(String token) {
        Claims claims = getClaims(token);
        return claims.get("userId", String.class); // userId 추출
    }
}
