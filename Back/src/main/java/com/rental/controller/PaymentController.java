package com.rental.controller;

import com.rental.dto.UserDTO;
import com.rental.service.PortOneService;
import com.rental.service.UserService;
import com.rental.token.TokenProvider;

import io.jsonwebtoken.Claims;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PortOneService portOneService;
    private final TokenProvider tokenProvider;
    private final UserService userService;

    public PaymentController(PortOneService portOneService, TokenProvider tokenProvider, UserService userService) {
        this.portOneService = portOneService;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    @PostMapping("/paymentUser")
    public ResponseEntity<?> findUser(@CookieValue(value = "token", required = false) String token) {
        System.out.println("paymentUser token : " + token);

        if (token == null || !tokenProvider.isValidToken(token)) {
            return ResponseEntity.badRequest().body("로그인이 필요합니다.");
        }

        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("userId", String.class);
        System.out.println("paymentUser userId : " + userId);
        if (userId == null) {
            return ResponseEntity.badRequest().body("로그인이 필요합니다.");
        }

        UserDTO user = userService.getPaymentUser(userId);

        System.out.println("paymentUser user : " + user);

        return ResponseEntity.ok(user);



    }

    @PostMapping("/registerCustomer")
    public ResponseEntity<?> registerCustomer(@RequestBody Map<String, String> map) {
        String customerUid = map.get("customerUid");
        System.out.println("customerUid : " + customerUid);
        if (customerUid == null || customerUid.isEmpty()) {
            return ResponseEntity.badRequest().body("customerUid가 필요합니다.");
        }

        System.out.println("고객 등록 요청: customerUid = " + customerUid);

        Map<String, Object> response = portOneService.registerCustomer(customerUid);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/autoPayment")
    public ResponseEntity<?> requestBillingPayment(@RequestBody Map<String, String> map) {
        String customerUid = map.get("customerUid");
        String amount = map.get("amount");
        String buyer_name = map.get("buyer_name");
        String buyer_email = map.get("buyer_email");
        String buyer_phone = map.get("buyer_phone");

        System.out.println(
            "autoPayment : " + customerUid + ", " + amount + ", " + buyer_name + ", " + buyer_email + ", " + buyer_phone);


        System.out.println("자동 결제 요청: customerUid = " + customerUid);

        System.out.println("access_token : " + portOneService.getPortOneAccessToken());

        Map<String, Object> response = portOneService.requestBillingPayment(customerUid, amount, buyer_name, buyer_email, buyer_phone);

        if(response == null) {
            return ResponseEntity.badRequest().body("요청 실패");
        }
        int point = Integer.parseInt(amount);
        int count = userService.updatePoint(buyer_name, point);
        System.out.println("updatePoint count : " + count);
        return ResponseEntity.ok(response);
    }

}
