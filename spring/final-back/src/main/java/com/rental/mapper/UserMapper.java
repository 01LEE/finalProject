package com.rental.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.rental.dto.UserDTO;

@Mapper

public interface UserMapper {  
    UserDTO selectIdUser(String userId, String passWord); // 구현체 제거
}