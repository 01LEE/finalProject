package com.rental.controller;

import com.rental.dto.CommentDTO;
import com.rental.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments") // ✅ 모든 댓글 API의 기본 경로 설정
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // ✅ 특정 게시글의 댓글 목록 조회 (GET /comments/{postNo})
    @GetMapping("/{postNo}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPost(@PathVariable int postNo) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postNo));
    }

    // ✅ 댓글 등록 후 최신 댓글 반환 (POST /comments)
    @PostMapping("")
    public ResponseEntity<CommentDTO> insertComment(@RequestBody CommentDTO comment) {
        commentService.insertComment(comment);
        CommentDTO latestComment = commentService.getLatestCommentByPost(comment.getPostNo());
        return ResponseEntity.ok(latestComment);
    }
}
