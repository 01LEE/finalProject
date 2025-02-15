package com.rental.mapper;

import com.rental.dto.PostDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface PostMapper {
    // ✅ 모든 게시글 조회
    List<PostDTO> getAllPosts();

    // ✅ 단일 게시글 조회 (XML에서 정의, 어노테이션 제거)
    PostDTO getPostById(int postNo);

    // ✅ 게시글 등록 (XML에서 정의)
    void insertPost(PostDTO post);

    // ✅ 최신 게시글 가져오기 (XML에서 정의)
    PostDTO getLatestPostByUser(int userNo);
}
