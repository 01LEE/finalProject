package com.rental.service;

import com.rental.dto.CommentDTO;
import com.rental.mapper.CommentMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {

    private final CommentMapper commentMapper;

    public CommentService(CommentMapper commentMapper) {
        this.commentMapper = commentMapper;
    }

    public List<CommentDTO> getCommentsByPost(int postNo) {
        return commentMapper.getCommentsByPost(postNo);
    }

    public void insertComment(CommentDTO comment) {
        commentMapper.insertComment(comment);
    }

    public CommentDTO getLatestCommentByPost(int postNo) {
        return commentMapper.getLatestCommentByPost(postNo);
    }
}
