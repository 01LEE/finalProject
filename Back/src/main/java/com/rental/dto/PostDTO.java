package com.rental.dto;

import java.time.LocalDateTime;

public class PostDTO {

    private int postNo;            // post_no
    private int userNo;            // user_no
    private String title;          // title
    private String content;        // content
    private LocalDateTime createDate; // create_date
    private LocalDateTime updatedDate; // updated_date

    // 기본 생성자
    public PostDTO() {
    }

    // 모든 필드를 포함하는 생성자
    public PostDTO(int postNo, int userNo, String title, String content, LocalDateTime createDate, LocalDateTime updatedDate) {
        this.postNo = postNo;
        this.userNo = userNo;
        this.title = title;
        this.content = content;
        this.createDate = createDate;
        this.updatedDate = updatedDate;
    }

    // Getter and Setter
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    @Override
    public String toString() {
        return "PostDTO{" +
                "postNo=" + postNo +
                ", userNo=" + userNo +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", createDate=" + createDate +
                ", updatedDate=" + updatedDate +
                '}';
    }
}
