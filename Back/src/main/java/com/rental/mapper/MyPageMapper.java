package com.rental.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.rental.dto.UserDTO;

@Mapper
public interface MyPageMapper {
    UserDTO getUserInfo(String userId);
    int confirmPasword(String userId, String passWord);
    int checkKakao(String userId);

    int getPoint(String userId);
    int getUserPoint(int userNo);

    void updateUserPoint(@Param("userNo") int userNo, @Param("newPoint") int newPoint);

    
    int deleteUser(String userId);
    int updateProfile(Map<String, Object> params);
    


}
