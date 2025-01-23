package com.rental.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rental.token.TokenProvider;


@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*",allowCredentials = "true")
@RestController
public class CookieController {
    private final TokenProvider tokenProvider;

    public CookieController(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @GetMapping("/auth/validate")
    public ResponseEntity<String> validateToken(@CookieValue(value = "token", required = false) String token) {
        System.out.println("server token : " + token);
        if (token == null || !tokenProvider.isValidToken(token)) {
            System.out.println("token : " + token);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
        }
        return ResponseEntity.ok("Token is valid");
    }

}
