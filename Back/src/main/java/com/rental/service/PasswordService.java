package com.rental.service;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    private final BCryptPasswordEncoder passwordEncoder;

    public PasswordService(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    // 비밀번호 해싱
    public String hashPassword(String password) {
        String HashPassword = passwordEncoder.encode(password);
        System.out.println("HashPassword : " + HashPassword);
        return HashPassword;
    }

    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        if (rawPassword == null || hashedPassword == null) {
            throw new IllegalArgumentException("비밀번호 또는 해시값이 비어 있습니다.");
        }
        System.out.println("rawPassword : " + rawPassword + ", hashedPassword : " + hashedPassword);
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable() // CSRF 비활성화
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/**").permitAll() // 모든 요청 허용
            );
        return http.build();
    }

}
