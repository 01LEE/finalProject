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
import org.springframework.stereotype.Component;

@Component
public class TokenProvider {

   private final UserService userService;

    public TokenProvider(UserService userService) {
        this.userService = userService;
    }
    





    private final long expiredTime = 1000L * 60L * 60L; // 1시간
    private final SecretKey key = Keys
            .hmacShaKeyFor("ThisIsA256BitSecretKeyForJWTGeneration!".getBytes(StandardCharsets.UTF_8));

    public String generateToken(String userId, String passWord) {
        Date expire = new Date(System.currentTimeMillis() + expiredTime);
        System.out.println("userId : " + userId);
        System.out.println("passWord : " + passWord);

        UserDTO dto = userService.loginService(userId, passWord);


        System.out.println("dto :" + dto);
      
        if (dto != null && dto.getUserId().equals(userId)) {
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

    /**
     * 토큰에서 사용자 ID 추출
     */
    public String getUserIDFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("userId", String.class);
        } catch (Exception e) {
            System.err.println("토큰에서 사용자 ID를 추출하는 중 오류 발생: " + e.getMessage());
            return null;
        }
    }
}
