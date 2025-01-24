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
}
