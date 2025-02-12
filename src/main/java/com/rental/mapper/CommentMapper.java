package com.rental.mapper;

import com.rental.dto.CommentDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface CommentMapper {
    List<CommentDTO> getCommentsByPost(int postNo);
    void insertComment(CommentDTO comment);
    CommentDTO getLatestCommentByPost(int postNo);
}
