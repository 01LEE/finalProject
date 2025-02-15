package com.rental.service;

import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final Map<String, String> verificationCodes = new HashMap<>();

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendVerificationCode(String email) {
        String code = generateVerificationCode();
        verificationCodes.put(email, code);
        System.out.println("이메일 : " + email);
        System.out.println("인증 코드 : " + code);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("이메일 인증 코드");
            helper.setText("<h1>인증 코드: " + code + "</h1>", true);

            mailSender.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean verifyCode(String email, String code) {
        System.out.println("email : " + email + ", code : " + code);
        System.out.println("verificationCodes : " + verificationCodes);
        if (verificationCodes.containsKey(email)) {
            String storedCode = verificationCodes.get(email);
            System.out.println("storedCode : " + storedCode);
            if (storedCode.equals(code)) {
                verificationCodes.remove(email); // 인증 완료 후 삭제
                return true;
            }
        }
        return false;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6자리 인증 코드 생성
        return String.valueOf(code);
    }
}
