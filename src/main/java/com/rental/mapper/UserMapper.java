package com.rental.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.rental.dto.UserDTO;

@Mapper

public interface UserMapper {  
    UserDTO selectIdUser(String userId, String passWord); // 구현체 제거
    int SelectId(String userId);
    int SelectNickname(String nickname);
    String findId(String email, String name);
	String SelectEmail(String userId);
    int confirmPassword(String userId, String password);
    UserDTO selectPassword(String userId);
    int changePassword(String userId, String password);
    int insertUser(String userId, String password, String email, String name, String nickname);
    UserDTO findById(String userId);
    int findUserNoByUserId(String userId);
    int MatchKakaoEmail(String kakaoEmail);
    UserDTO findByEmail(String email);
}