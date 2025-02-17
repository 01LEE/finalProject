package com.rental.dto;

public class ShoppingPaymentDTO {
    private int paymentNo;  // 결제 번호
    private int userNo;     // 사용자 번호

    // 기본 생성자
    public ShoppingPaymentDTO() {}

    // 모든 필드를 포함하는 생성자
    public ShoppingPaymentDTO(int paymentNo, int userNo) {
        this.paymentNo = paymentNo;
        this.userNo = userNo;
    }

    // Getter & Setter
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

    // toString() (디버깅용)
    @Override
    public String toString() {
        return "ShoppingPaymentDTO{" +
                "paymentNo=" + paymentNo +
                ", userNo=" + userNo +
                '}';
    }
}
