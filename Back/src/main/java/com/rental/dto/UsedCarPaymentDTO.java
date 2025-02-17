package com.rental.dto;

public class UsedCarPaymentDTO {
    private int paymentNo;  // DB에 저장될 결제번호
    private int userNo;     // DB에 저장될 사용자 번호
    private String vehicleNo; // 클라이언트에서 넘어오는 차량 번호 (결제 상세용)
    private int point;        // 결제할 포인트 (사용자 보유 포인트와 비교)

    public UsedCarPaymentDTO() {}

    public UsedCarPaymentDTO(int userNo, int paymentNo, String vehicleNo, int point) {
        this.userNo = userNo;
        this.paymentNo = paymentNo;
        this.vehicleNo = vehicleNo;
        this.point = point;
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
                "paymentNo=" + paymentNo +
                ", userNo=" + userNo +
                ", vehicleNo='" + vehicleNo + '\'' +
                ", point=" + point +
                '}';
    }
}
