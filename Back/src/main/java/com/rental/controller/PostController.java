package com.rental.controller;

import com.rental.dto.PostDTO;
import com.rental.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000") // React에서 API 호출 허용
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // ✅ 모든 게시글 조회
    @GetMapping
    public List<PostDTO> getAllPosts() {
        return postService.getAllPosts();
    }

    // ✅ 단일 게시글 조회
    @GetMapping("/{postNo}")
    public ResponseEntity<?> getPostById(@PathVariable int postNo) {
        PostDTO post = postService.getPostById(postNo);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(post);
    }

    // ✅ 게시글 등록
    @PostMapping("/create")
    public ResponseEntity<?> insertPost(@RequestBody PostDTO post) {
        try {
            if (post.getUserNo() == 0) {
                return ResponseEntity.badRequest().body("userNo가 필요합니다.");
            }
            System.out.println("📌 요청 받은 데이터: " + post.toString());
            postService.insertPost(post);
            return ResponseEntity.ok("게시글이 등록되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 등록 중 오류 발생");
        }
    }
}
