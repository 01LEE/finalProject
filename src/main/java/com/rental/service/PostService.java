package com.rental.service;

import com.rental.dto.PostDTO;
import com.rental.mapper.PostMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostService {
    private final PostMapper postMapper;

    public PostService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }

    public List<PostDTO> getAllPosts() {
        return postMapper.getAllPosts();
    }

    public PostDTO getPostById(int postNo) {
        return postMapper.getPostById(postNo);
    }

    public void insertPost(PostDTO post) {
        postMapper.insertPost(post);
    }
}
