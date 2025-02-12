package com.rental.dto;
public class RentalCarDTO {

    private String rentalCarNo;    // 차량 번호
    private String model;          // 모델명
    private Double pricePerDay; // 일일 대여 요금
    private String status;         // 차량 상태
    private String type;           // 차량 유형
    private String location;       // 위치
    private int field;         // 기타 필드
    private String fuel;           // 연료 유형

    // 기본 생성자
    public RentalCarDTO() {}

    // 매개변수 생성자
    public RentalCarDTO(String rentalCarNo, String model, Double pricePerDay, String status, String type, String location, int field, String fuel) {
        this.rentalCarNo = rentalCarNo;
        this.model = model;
        this.pricePerDay = pricePerDay;
        this.status = status;
        this.type = type;
        this.location = location;
        this.field = field;
        this.fuel = fuel;
    }

    // Getters and Setters
    public String getRentalCarNo() {
        return rentalCarNo;
    }

    public void setRentalCarNo(String rentalCarNo) {
        this.rentalCarNo = rentalCarNo;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(Double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getField() {
        return field;
    }

    public void setField(int field) {
        this.field = field;
    }

    public String getFuel() {
        return fuel;
    }

    public void setFuel(String fuel) {
        this.fuel = fuel;
    }
}
