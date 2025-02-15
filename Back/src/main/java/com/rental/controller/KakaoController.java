package com.rental.controller;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.rental.dto.UserDTO;
import com.rental.service.UserService;
import com.rental.token.TokenProvider;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
public class KakaoController {

    private UserService userservice;
    private TokenProvider tokenProvider;

    public KakaoController(UserService userService, TokenProvider tokenProvider) {
        this.userservice = userService;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("kakaoLogin")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> map, HttpServletResponse response) {

        String code = map.get("code");
        String kakaoTokenURL = "https://kauth.kakao.com/oauth/token";

        System.out.println("code : " + code);
        System.out.println("kakaoTokenURL : " + kakaoTokenURL);

        RestTemplate restTemplate = new RestTemplate(); // HTTP 요청을 보내는 객체

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // 요청의 Content-Type 설정 (폼 데이터)

        String params = "grant_type=authorization_code"
                + "&client_id=cecb22bd73d34e37cec309f2ae8a4eae"
                + "&redirect_uri=http://localhost:3000/auth/kakao/callback"
                + "&code=" + code; // Kakao에서 받은 인가 코드 포함

        HttpEntity<String> request = new HttpEntity<>(params, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.exchange(kakaoTokenURL, HttpMethod.POST, request, Map.class);

        String accessToken = (String) tokenResponse.getBody().get("access_token");
        System.out.println("받은 Access Token: " + accessToken);

        String kakaoUserURL = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(accessToken);

        HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
        ResponseEntity<Map> userResponse = restTemplate.exchange(kakaoUserURL, HttpMethod.GET, userRequest, Map.class);

        System.out.println("사용자 정보: " + userResponse.getBody());

        Map<String, Object> userInfo = (Map<String, Object>) userResponse.getBody().get("kakao_account");
        String kakaoEmail = null;
        String nickname = null;
        if (userInfo != null) {
            kakaoEmail = (String) userInfo.get("email");
            Map<String, Object> profile = (Map<String, Object>) userInfo.get("profile");
            if (profile != null) {
                nickname = (String) profile.get("nickname");
            }
        } else {
            return ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).body("이메일 정보를 찾을 수 없습니다.");
        }

        int count = userservice.MatchKakaoEmail(kakaoEmail);
        System.out.println("MatchKakoEmail count : " + count);

        if (count == 0) {
            return ResponseEntity.ok().body(Map.of(
                    "register", true,
                    "email", kakaoEmail,
                    "nickname", nickname));
        }


        System.out.println("token 생성 중...");
        System.out.println(kakaoEmail);
        UserDTO user = userservice.findByEmail(kakaoEmail);
        String token = tokenProvider.generateToken(user.getUserId(), user.getRole());
        if (token == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("토큰 생성 중 문제가 발생했습니다.");
        }

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // HTTPS 환경에서만 전송
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1시간

        response.addCookie(cookie);

        int kakao = userservice.setIsKakao(user.getUserId());
        System.out.println("kakao : " + kakao);
    


        return ResponseEntity.ok("로그인 성공");



    }

}