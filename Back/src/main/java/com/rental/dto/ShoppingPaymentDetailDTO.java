package com.rental.dto;

import java.util.Date;

public class ShoppingPaymentDetailDTO {
    private int productId;       // 상품 번호
    private int paymentNo;       // 결제 번호
    private int userNo;          // 사용자 번호
    private String productName;  // 상품명
    private int productAllPrice; // 총 상품 가격
    private Date paymentDate;    // 결제 날짜
    private int productCount;    // 상품 개수

    // 기본 생성자
    public ShoppingPaymentDetailDTO() {}

    // 모든 필드를 포함하는 생성자
    public ShoppingPaymentDetailDTO(int productId, int paymentNo, int userNo, String productName,
                                    int productAllPrice, Date paymentDate, int productCount) {
        this.productId = productId;
        this.paymentNo = paymentNo;
        this.userNo = userNo;
        this.productName = productName;
        this.productAllPrice = productAllPrice;
        this.paymentDate = paymentDate;
        this.productCount = productCount;
    }

    // Getter & Setter
    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getPaymentNo() {
        return paymentNo;
    }

    public void setPaymentNo(int paymentNo) {
        this.paymentNo = paymentNo;
    }

    public int getUserNo() {
        return userNo;
    }

    public void setUserNo(int userNo) {
        this.userNo = userNo;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getProductAllPrice() {
        return productAllPrice;
    }

    public void setProductAllPrice(int productAllPrice) {
        this.productAllPrice = productAllPrice;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public int getProductCount() {
        return productCount;
    }

    public void setProductCount(int productCount) {
        this.productCount = productCount;
    }

    // toString() (디버깅용)
    @Override
    public String toString() {
        return "ShoppingPaymentDetailDTO{" +
                "productId=" + productId +
                ", paymentNo=" + paymentNo +
                ", userNo=" + userNo +
                ", productName='" + productName + '\'' +
                ", productAllPrice=" + productAllPrice +
                ", paymentDate=" + paymentDate +
                ", productCount=" + productCount +
                '}';
    }
}
