package com.rental.service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

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

    public int deleteUser(String userId) {
        return mapper.deleteUser(userId);
    }

    public int updateProfile(String userId, Map<String, String> request) {
        String name = request.get("name");
        String address = request.get("address");
        String addressDetail = request.get("addressDetail");
        String profileImage = request.get("profileImage");

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        params.put("name", name);
        params.put("address", address);
        params.put("addressDetail", addressDetail);

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                byte[] imageBytes = Base64.getDecoder().decode(profileImage); // 🔥 Base64 디코딩
                params.put("profileImage", imageBytes);
                System.out.println("Base64 디코딩된 이미지 크기: " + imageBytes.length + " bytes");
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
                System.out.println("Base64 디코딩 실패");
                params.put("profileImage", null);
            }
        } else {
            params.put("profileImage", null);
        }

        System.out.println("updateProfile params: " + params);
        return mapper.updateProfile(params);
    }

}
