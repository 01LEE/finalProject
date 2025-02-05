package com.rental.dto;

public class UsedCarPaymentDTO {

  private int userNo;       // user_no
  private String vehicleNo; // vehicle_no
  private int point;        // point

  // 기본 생성자
  public UsedCarPaymentDTO() {
  }

  // 모든 필드를 포함하는 생성자
  public UsedCarPaymentDTO(int userNo, String vehicleNo, int point) {
    this.userNo = userNo;
    this.vehicleNo = vehicleNo;
    this.point = point;
  }

  // Getter and Setter
  public int getUserNo() {
    return userNo;
  }

  public void setUserNo(int userNo) {
    this.userNo = userNo;
  }

  public String getVehicleNo() {
    return vehicleNo;
  }

  public void setVehicleNo(String vehicleNo) {
    this.vehicleNo = vehicleNo;
  }

  public int getPoint() {
    return point;
  }

  public void setPoint(int point) {
    this.point = point;
  }

  @Override
  public String toString() {
    return "UsedCarPaymentDTO{" +
        "userNo=" + userNo +
        ", vehicleNo='" + vehicleNo + '\'' +
        ", point=" + point +
        '}';
  }
}
