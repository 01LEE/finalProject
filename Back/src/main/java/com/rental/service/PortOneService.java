package com.rental.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PortOneService {

    private static final String PORTONE_API_KEY = "5126077616510371"; // 포트원 API 키
    private static final String PORTONE_API_SECRET = "lPSZenTD6eGr2ZDlxYyf1PSZ1eN1jUQy4yDNEGyXhutgdMqGL1PTUIVBU85hXondTAj7bFQ80oI3vxmt"; // 포트원
                                                                                                                                         // 시크릿
    private static final String PORTONE_TOKEN_URL = "https://api.iamport.kr/users/getToken";
    private static final String PORTONE_BILLING_URL = "https://api.iamport.kr/subscribe/payments/again";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public PortOneService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String getPortOneAccessToken() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("imp_key", PORTONE_API_KEY);
        requestBody.put("imp_secret", PORTONE_API_SECRET);

        try {
            String jsonRequest = objectMapper.writeValueAsString(requestBody); // JSON 변환

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(jsonRequest, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    PORTONE_TOKEN_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class);

            if (response.getBody() != null && response.getBody().get("response") != null) {
                Map<String, Object> responseData = (Map<String, Object>) response.getBody().get("response");
                return (String) responseData.get("access_token");
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 변환 오류: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("포트원 API 요청 실패: " + e.getMessage());
        }
        return null;
    }

    public Map<String, Object> registerCustomer(String customerUid) {
        String accessToken = getPortOneAccessToken();
        String url = "https://api.iamport.kr/subscribe/customers/" + customerUid;

        // 고객 정보를 담을 요청 데이터 구성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("card_number", "9410-9999-9999-9999"); // 테스트용 카드 번호
        requestBody.put("expiry", "2028-12"); // 유효기간 (YYYY-MM)
        requestBody.put("birth", "920101"); // 생년월일 (6자리)
        requestBody.put("pwd_2digit", "19"); // 카드 비밀번호 앞 2자리
        requestBody.put("buyer_name", "홍길동");
        requestBody.put("buyer_email", "test@example.com");
        try {
            String jsonRequestBody = objectMapper.writeValueAsString(requestBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            HttpEntity<String> entity = new HttpEntity<>(jsonRequestBody, headers);

            // 포트원 API에 고객 등록 요청
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Map.class);

            System.out.println("✅ 고객 등록 응답: " + response.getBody());

            return response.getBody();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 변환 오류: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("고객 등록 요청 실패: " + e.getMessage());
        }
    }

    public Map<String, Object> requestBillingPayment(String customerUid, String amount, String buyer_name, String buyer_email , String buyer_phone) {
        String accessToken = getPortOneAccessToken();
        String merchantUid = "order_" + System.currentTimeMillis();

        System.out.println("요청 받은 금액 : " + amount);

        // 요청 데이터 구성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("customer_uid", customerUid);
        requestBody.put("merchant_uid", merchantUid);
        requestBody.put("amount", amount);
        requestBody.put("name", "포인트 충전");
        requestBody.put("buyer_name",  buyer_name);
        requestBody.put("buyer_email", buyer_email);
        requestBody.put("buyer_tel", buyer_phone);
        requestBody.put("customer_uid_usage", "payment"); // 고객 식별 정보


        try {
            // JSON 문자열로 변환
            String jsonRequestBody = objectMapper.writeValueAsString(requestBody);
            System.out.println("전송할 JSON 데이터: " + jsonRequestBody);

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken); // Authorization 헤더 추가

            // HTTP 요청 엔티티 생성
            HttpEntity<String> entity = new HttpEntity<>(jsonRequestBody, headers);

            // 포트원 API에 자동 결제 요청 보내기
            ResponseEntity<Map> response = restTemplate.exchange(
                    PORTONE_BILLING_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class);

            System.out.println("자동 결제 응답: " + response.getBody());

            return response.getBody();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 변환 오류: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("자동 결제 요청 실패: " + e.getMessage());
        }

    }
}
