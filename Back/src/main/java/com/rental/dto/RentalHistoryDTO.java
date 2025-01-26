package com.rental.dto;

import java.time.LocalDate;

public class RentalHistoryDTO {

  private int rentalNo;       // rental_no
  private String rentalCarNo;  // rental_car_no
  private int userNo;         // user_no
  private LocalDate startDate; // start_date
  private LocalDate endDate;   // end_date

  // 기본 생성자
  public RentalHistoryDTO() {
  }

  // 모든 필드를 포함하는 생성자
  public RentalHistoryDTO(int rentalNo, String rentalCarNo, int userNo, LocalDate startDate, LocalDate endDate) {
    this.rentalNo = rentalNo;
    this.rentalCarNo = rentalCarNo;
    this.userNo = userNo;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  // Getter and Setter
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

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public LocalDate getEndDate() {
    return endDate;
  }

  public void setEndDate(LocalDate endDate) {
    this.endDate = endDate;
  }

  @Override
  public String toString() {
    return "RentalHistoryDTO{" +
        "rentalNo=" + rentalNo +
        ", rentalCarNo='" + rentalCarNo + '\'' +
        ", userNo=" + userNo +
        ", startDate=" + startDate +
        ", endDate=" + endDate +
        '}';
  }
}
