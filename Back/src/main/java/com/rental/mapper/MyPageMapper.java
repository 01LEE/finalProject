package com.rental.mapper;

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
    


}
