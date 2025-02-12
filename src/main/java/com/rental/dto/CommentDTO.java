package com.rental.dto;

import java.time.LocalDateTime;

public class CommentDTO {

    private int commentNo;          // comment_no
    private int postNo;             // post_no
    private int userNo;             // user_no
    private String content;         // content
    private LocalDateTime createdDate; // created_date

    // 기본 생성자
    public CommentDTO() {
    }

    // 모든 필드를 포함하는 생성자
    public CommentDTO(int commentNo, int postNo, int userNo, String content, LocalDateTime createdDate) {
        this.commentNo = commentNo;
        this.postNo = postNo;
        this.userNo = userNo;
        this.content = content;
        this.createdDate = createdDate;
    }

    // Getter and Setter
    public int getCommentNo() {
        return commentNo;
    }

    public void setCommentNo(int commentNo) {
        this.commentNo = commentNo;
    }

    public int getPostNo() {
        return postNo;
    }

    public void setPostNo(int postNo) {
        this.postNo = postNo;
    }

    public int getUserNo() {
        return userNo;
    }

    public void setUserNo(int userNo) {
        this.userNo = userNo;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public String toString() {
        return "CommentDTO{" +
                "commentNo=" + commentNo +
                ", postNo=" + postNo +
                ", userNo=" + userNo +
                ", content='" + content + '\'' +
                ", createdDate=" + createdDate +
                '}';
    }
}
