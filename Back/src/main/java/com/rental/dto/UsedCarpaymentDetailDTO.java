package com.rental.dto;

import java.sql.Timestamp;

public class UsedCarpaymentDetailDTO {
    private String vehicleNo;     // 기존 "vehicleno" → "vehicleNo"
    private int paymentNo;        // 기존 "paymentno" → "paymentNo"
    private Timestamp paymentDate; // 기존 "paymentdate" → "paymentDate"

    public UsedCarpaymentDetailDTO() {}

    public UsedCarpaymentDetailDTO(String vehicleNo, int paymentNo, Timestamp paymentDate) {
        this.vehicleNo = vehicleNo;
        this.paymentNo = paymentNo;
        this.paymentDate = paymentDate;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public int getPaymentNo() {
        return paymentNo;
    }

    public void setPaymentNo(int paymentNo) {
        this.paymentNo = paymentNo;
    }

    public Timestamp getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Timestamp paymentDate) {
        this.paymentDate = paymentDate;
    }

    @Override
    public String toString() {
        return "UsedCarpaymentDetailDTO{" +
                "vehicleNo='" + vehicleNo + '\'' +
                ", paymentNo=" + paymentNo +
                ", paymentDate=" + paymentDate +
                '}';
    }
}
