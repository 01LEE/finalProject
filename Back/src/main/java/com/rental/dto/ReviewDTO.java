package com.rental.dto;

import java.time.LocalDateTime;

public class ReviewDTO {

    private int reviewNo;          // review_no
    private int productId;         // product_id
    private int userNo;            // user_no
    private String content;        // content
    private LocalDateTime createdDate; // created_date
    private int evaluation;        // evaluation
    private String userId;

    // 기본 생성자
    public ReviewDTO() {
    }

    // 모든 필드를 포함하는 생성자
    public ReviewDTO(int reviewNo, int productId, int userNo, String content, LocalDateTime createdDate, int evaluation, String userId) {
        this.reviewNo = reviewNo;
        this.productId = productId;
        this.userNo = userNo;
        this.content = content;
        this.createdDate = createdDate;
        this.evaluation = evaluation;
        this.userId = userId;
    }

    // Getter and Setter
    public int getReviewNo() {
        return reviewNo;
    }

    public void setReviewNo(int reviewNo) {
        this.reviewNo = reviewNo;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
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

    public int getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(int evaluation) {
        this.evaluation = evaluation;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

   

    @Override
    public String toString() {
        return "ReviewDTO{" +
                "reviewNo=" + reviewNo +
                ", productId=" + productId +
                ", userNo=" + userNo +
                ", content='" + content + '\'' +
                ", createdDate=" + createdDate +
                ", evaluation=" + evaluation +
                ", userId='" + userId + '\'' +
                '}';
    }
}