package com.rental.controller;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class PaymentController {

    private static final String PORTONE_API_KEY = "5126077616510371"; // 포트원 API 키
    private static final String PORTONE_API_SECRET = "lPSZenTD6eGr2ZDlxYyf1PSZ1eN1jUQy4yDNEGyXhutgdMqGL1PTUIVBU85hXondTAj7bFQ80oI3vxmt"; // 포트원
                                                                                                                                         // API
                                                                                                                                         // 시크릿

    @PostMapping("/payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        String impUid = payload.get("imp_uid");

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + getPortOneAccessToken());

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.iamport.kr/payments/" + impUid,
                HttpMethod.GET,
                entity,
                Map.class);

        Map<String, Object> responseBody = response.getBody();
        System.out.println("결제 검증 결과: " + responseBody);

        return ResponseEntity.ok(responseBody);
    }

    // 포트원 Access Token 발급 함수
    private String getPortOneAccessToken() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        String requestBody = "{"
                + "\"imp_key\": \"" + PORTONE_API_KEY + "\","
                + "\"imp_secret\": \"" + PORTONE_API_SECRET + "\""
                + "}";

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.iamport.kr/users/getToken",
                HttpMethod.POST,
                entity,
                Map.class);

        Map<String, Object> responseBody = response.getBody();
        return (String) ((Map<String, Object>) responseBody.get("response")).get("access_token");
    }
}
