package com.rental.service;

import com.rental.dto.UserDTO;
import com.rental.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserMapper mapper;

    // 생성자를 통한 의존성 주입
    @Autowired
    public UserService(UserMapper mapper) {
        this.mapper = mapper;
    }

    // 로그인 서비스
    public UserDTO loginService(String userId, String passWord) {
        UserDTO user = mapper.selectIdUser(userId, passWord);
        if (user == null) {
            System.out.println("존재하지 않는 아이디 입니다.");
            return null;
        }
        return user;
    }

    public int SelectId(String userId) {
        return mapper.SelectId(userId);
    }

    public int SelectNickname(String nickname) {
        return mapper.SelectNickname(nickname);
    }

    public String findId(String email, String name) {
        return mapper.findId(email, name);
    }

    public String SelectEmail(String userId) {
        return mapper.SelectEmail(userId);
    }

    public int confirmPassword(String userId, String password) {
        return mapper.confirmPassword(userId, password);
    }

    public UserDTO selectPassword(String userId) {
        return mapper.selectPassword(userId);
    }

    public int changePassword(String userId, String password) {
        return mapper.changePassword(userId, password);
    }

    public int insertUser(String userId, String password, String email, String name, String nickname) {
        System.out.println("insertUser : " + userId + " " + password + " " + email + " " + name + " " + nickname);
        return mapper.insertUser(userId, password, email, name, nickname);
    }

    public UserDTO findById(String userId) {
        System.out.println("findById : " + userId);
        return mapper.findById(userId);
    }

    public UserDTO findByEmail(String email) {
        System.out.println("findByEmail : " + email);
        return mapper.findByEmail(email);
    }
    
    

    public int MatchKakaoEmail(String kakaoEmail) {
        return mapper.MatchKakaoEmail(kakaoEmail);
    }
}
