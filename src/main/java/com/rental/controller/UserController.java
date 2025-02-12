package com.rental.controller;

import com.rental.token.TokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import com.rental.dto.UserDTO;
import com.rental.service.UserService;
import com.rental.service.PasswordService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true", exposedHeaders = {"user-role"})
public class UserController {

    private final TokenProvider tokenProvider;
    private final UserService userService;
    private final PasswordService passwordService;

    public UserController(TokenProvider tokenProvider, UserService userService, PasswordService passwordService) {
        this.tokenProvider = tokenProvider;
        this.userService = userService;
        this.passwordService = passwordService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> map, HttpServletResponse response) {
        System.out.println("login...");

        String userId = map.get("id");
        String passWord = map.get("pwd");

        System.out.println("userId : " + userId + ", passWord : " + passWord);

        // 유효성 검사
        if (userId == null || passWord == null) {
            return ResponseEntity.badRequest().body("아이디와 비밀번호를 입력하세요.");
        }

        // 사용자 정보 조회
        UserDTO user = userService.findById(userId);
        System.out.println("findById result: " + user);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("존재하지 않는 아이디입니다.");
        }

        // 비밀번호 검증
        boolean passwordMatch = passwordService.verifyPassword(passWord, user.getPassword());
        System.out.println("Password verification: " + passwordMatch);

        if (!passwordMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 잘못되었습니다.");
        }

        // 토큰 생성
        System.out.println("token 생성 중...");
        String token = tokenProvider.generateToken(user.getUserId(), user.getRole());
        System.out.println("token : " + token);

        // 토큰 생성 실패 처리
        if (token == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("토큰 생성 중 문제가 발생했습니다.");
        }

        System.out.println("token 생성 성공");


        // 쿠키 설정
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // HTTPS 환경에서만 전송
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1시간
        response.addCookie(cookie);

        response.addHeader("user-role", user.getRole());

        return ResponseEntity.ok("로그인 성공");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 쿠키 즉시 삭제

        response.addCookie(cookie);
        return ResponseEntity.ok("로그아웃 성공");
    }

    @PostMapping("/checkId")
    public ResponseEntity<?> checkUserId(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        System.out.println("userId : " + userId);
        int count = userService.SelectId(userId);

        System.out.println("count : " + count);
        if (count > 0) {
            return ResponseEntity.ok("success");
        }

        return null;
    }

    @PostMapping("/checkNickname")
    public ResponseEntity<?> checkNickname(@RequestBody Map<String, String> request) {
        String nickname = request.get("nickname");
        System.out.println("nickname : " + nickname);
        int count = userService.SelectNickname(nickname);

        return ResponseEntity.ok(count);
    }

    @PostMapping("findId")
    public ResponseEntity<?> findId(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");

        System.out.println("email : " + email);
        System.out.println("name : " + name);

        String userId = userService.findId(email, name);
        if (userId != null) {
            return ResponseEntity.ok(userId); // 성공 시 아이디 반환
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("아이디를 찾을 수 없습니다."); // 실패 시 응답
        }
    }

    @PostMapping("verifyUser")
    public ResponseEntity<String> verifyUser(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");

        int count = userService.SelectId(userId);
        if (count > 0) {
            String email = userService.SelectEmail(userId);
            System.out.println("email : " + email);
            return ResponseEntity.ok(email);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("아이디를 찾을 수 없습니다.");
        }
    }

    @PostMapping("/confirmPassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String newpassword = request.get("newPassword");
        System.out.println("userId : " + userId);
        System.out.println("password : " + newpassword);

        UserDTO userPassword = userService.selectPassword(userId);
        System.out.println("user : " + userPassword);

        boolean isPasswordMatch = passwordService.verifyPassword(newpassword, userPassword.getPassword());
        System.out.println("Password match: " + isPasswordMatch);

        if (passwordService.verifyPassword(newpassword, userPassword.getPassword())) {
            return ResponseEntity.ok("matched"); // 기존 비밀번호와 일치
        } else {
            return ResponseEntity.ok("not mathed"); 
        }

    }

    @PostMapping("/successChangePassword")
    public ResponseEntity<String> successChangePassword(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String password = request.get("newPassword");
        System.out.println("userId : " + userId);
        System.out.println("password : " + password);

        String hashedPassword = passwordService.hashPassword(password);
        System.out.println("hashedPassword : " + hashedPassword);

        int count = userService.changePassword(userId, hashedPassword);
        System.out.println("count : " + count);

        if (count > 0) {
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 변경에 실패했습니다.");
        }
    }

    @PostMapping("/successSignUp")
    public ResponseEntity<String> successSighnUp(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String password = request.get("password");
        String HashPassword = passwordService.hashPassword(password);
        String email = request.get("email");
        String name = request.get("name");
        String nickname = request.get("nickname");
        System.out.println(
                "userId : " + userId + " password encoded => " + HashPassword + " email : " + email + " name : " + name
                        + " nickname : " + nickname);

        int count = userService.insertUser(userId, HashPassword, email, name, nickname);
        System.out.println("count : " + count);

        return ResponseEntity.ok("success");
    }

}