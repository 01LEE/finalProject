package com.rental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.rental.mapper.MyPageMapper;
import com.rental.dto.UserDTO;


@Service
public class MyPageService {

    private final MyPageMapper mapper;

     @Autowired
    public MyPageService(MyPageMapper mapper) {
        this.mapper = mapper;
    }
    public UserDTO getUserInfo(String userId) {
        return mapper.getUserInfo(userId);
    }
    public int confirmPasword(String userId, String passWord) {
        return mapper.confirmPasword(userId, passWord);
    }
    public int checkKakao(String userId) {
        return mapper.checkKakao(userId);
    }
    
}
