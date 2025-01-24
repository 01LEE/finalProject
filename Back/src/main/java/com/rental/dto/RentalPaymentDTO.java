package com.rental.dto;

import java.math.BigDecimal;

public class RentalPaymentDTO {

  private int rentalPaymentNo; // rental_payment_no
  private int rentalNo;        // rental_no
  private String rentalCarNo;  // rental_car_no
  private int userNo;          // user_no
  private int point;           // point
  private BigDecimal totalPrice; // total_price

  // 기본 생성자
  public RentalPaymentDTO() {
  }

  // 모든 필드를 포함하는 생성자
  public RentalPaymentDTO(int rentalPaymentNo, int rentalNo, String rentalCarNo, int userNo, int point, BigDecimal totalPrice) {
    this.rentalPaymentNo = rentalPaymentNo;
    this.rentalNo = rentalNo;
    this.rentalCarNo = rentalCarNo;
    this.userNo = userNo;
    this.point = point;
    this.totalPrice = totalPrice;
  }

  // Getter and Setter
  public int getRentalPaymentNo() {
    return rentalPaymentNo;
  }

  public void setRentalPaymentNo(int rentalPaymentNo) {
    this.rentalPaymentNo = rentalPaymentNo;
  }

  public int getRentalNo() {
    return rentalNo;
  }

  public void setRentalNo(int rentalNo) {
    this.rentalNo = rentalNo;
  }

  public String getRentalCarNo() {
    return rentalCarNo;
  }

  public void setRentalCarNo(String rentalCarNo) {
    this.rentalCarNo = rentalCarNo;
  }

  public int getUserNo() {
    return userNo;
  }

  public void setUserNo(int userNo) {
    this.userNo = userNo;
  }

  public int getPoint() {
    return point;
  }

  public void setPoint(int point) {
    this.point = point;
  }

  public BigDecimal getTotalPrice() {
    return totalPrice;
  }

  public void setTotalPrice(BigDecimal totalPrice) {
    this.totalPrice = totalPrice;
  }

  @Override
  public String toString() {
    return "RentalPaymentDTO{" +
        "rentalPaymentNo=" + rentalPaymentNo +
        ", rentalNo=" + rentalNo +
        ", rentalCarNo='" + rentalCarNo + '\'' +
        ", userNo=" + userNo +
        ", point=" + point +
        ", totalPrice=" + totalPrice +
        '}';
  }
}
