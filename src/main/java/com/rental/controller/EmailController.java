package com.rental.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.rental.service.EmailService;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/sendVerificationCode")
    public ResponseEntity<String> sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("email : " + email);

        // 이메일 유효성 검사
        if (!isValidEmail(email)) {
            System.out.println("유효하지 않는 이메일 형식 입니다.");
            return ResponseEntity.badRequest().body("유효하지 않은 이메일 형식입니다.");
        }

        boolean isSent = emailService.sendVerificationCode(email);
        if (isSent) {
            return ResponseEntity.ok("인증번호가 이메일로 전송되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 전송에 실패했습니다.");
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return Pattern.matches(emailRegex, email);
    }

    @PostMapping("/verifyCode")
public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String code = request.get("verificationCode");

    boolean isValid = emailService.verifyCode(email, code);

    Map<String, Object> response = new HashMap<>();
    response.put("isValid", isValid);
    System.out.println("isValid : " + isValid);
    return ResponseEntity.ok(response);
}

}
