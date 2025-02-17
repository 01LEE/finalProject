package com.rental.dto;

import java.util.List;

public class UsedCarDTO {

    private String vehicleName;    // vehicle_name
    private String vehicleNo;      // vehicle_no
    private int dealerNo;          // dealer_no
    private String vehicleType;    // vehicle_type
    private String brand;          // brand
    private int modelYear;         // model_year
    private int price;             // price
    private String color;          // color
    private String dealerLocation; // dealer_location
    private String fuelType;       // fuel_type
    private String transmission;   // transmission
    private String driveType;      // drive_type
    private String mainImage;      // 대표 이미지 경로
    private String vehiclePlate;   // vehicle_plate
    private int carKm;             // car_km
    private int seatingCapacity;   // seating_capacity
    private String description;   // description
    private int status;            // status

    // UsedCarImageDTO 목록 (전체 이미지 경로와 삭제된 이미지를 객체로 관리)
    private List<UsedCarImageDTO> usedCarImages;  // 차량에 연결된 이미지 목록

    // 삭제된 이미지 목록을 저장하는 필드
    private List<String> deletedImages;  // 삭제된 이미지 URL 목록


    public UsedCarDTO(String dealerLocation) {
        this.dealerLocation = dealerLocation;
    }
    // 기본 생성자
    public UsedCarDTO() {}

    // 모든 필드를 포함하는 생성자
    public UsedCarDTO(String vehicleName, String vehicleNo, int dealerNo, String vehicleType, String brand, int modelYear,
                      int price, String color, String dealerLocation, String fuelType,
                      String transmission, String driveType, String mainImage, String vehiclePlate, int carKm,
                      int seatingCapacity, List<UsedCarImageDTO> usedCarImages, List<String> deletedImages,String description) {
        this.vehicleName = vehicleName;
        this.vehicleNo = vehicleNo;
        this.dealerNo = dealerNo;
        this.vehicleType = vehicleType;
        this.brand = brand;
        this.modelYear = modelYear;
        this.price = price;
        this.color = color;
        this.dealerLocation = dealerLocation;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.driveType = driveType;
        this.mainImage = mainImage;
        this.vehiclePlate = vehiclePlate;
        this.carKm = carKm;
        this.seatingCapacity = seatingCapacity;
        this.usedCarImages = usedCarImages;
        this.deletedImages = deletedImages;
        this.description = description;
    }

    // Getter and Setter for usedCarImages
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
    public List<UsedCarImageDTO> getUsedCarImages() {
        return usedCarImages;
    }

    public void setUsedCarImages(List<UsedCarImageDTO> usedCarImages) {
        this.usedCarImages = usedCarImages;
    }

    // Getter and Setter for deletedImages
    public List<String> getDeletedImages() {
        return deletedImages;
    }

    public void setDeletedImages(List<String> deletedImages) {
        this.deletedImages = deletedImages;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // 기존 Getter 및 Setter 유지...
    public String getMainImage() {
        return mainImage;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public int getDealerNo() {
        return dealerNo;
    }

    public void setDealerNo(int dealerNo) {
        this.dealerNo = dealerNo;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public int getModelYear() {
        return modelYear;
    }

    public void setModelYear(int modelYear) {
        this.modelYear = modelYear;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDealerLocation() {
        return dealerLocation;
    }

    public void setDealerLocation(String dealerLocation) {
        this.dealerLocation = dealerLocation;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getTransmission() {
        return transmission;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public String getDriveType() {
        return driveType;
    }

    public void setDriveType(String driveType) {
        this.driveType = driveType;
    }

    public String getVehiclePlate() {
        return vehiclePlate;
    }

    public void setVehiclePlate(String vehiclePlate) {
        this.vehiclePlate = vehiclePlate;
    }

    public int getCar_km() {
        return carKm;
    }

    public void setCar_km(int carKm) {
        this.carKm = carKm;
    }

    public int getSeatingCapacity() {
        return seatingCapacity;
    }

    public void setSeatingCapacity(int seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
    }

    @Override
    public String toString() {
        return "UsedCarDTO{" +
                "vehicleName='" + vehicleName + '\'' +
                ", vehicleNo='" + vehicleNo + '\'' +
                ", dealerNo=" + dealerNo +
                ", vehicleType='" + vehicleType + '\'' +
                ", brand='" + brand + '\'' +
                ", modelYear=" + modelYear +
                ", price=" + price +
                ", color='" + color + '\'' +
                ", dealerLocation='" + dealerLocation + '\'' +
                ", fuelType='" + fuelType + '\'' +
                ", transmission='" + transmission + '\'' +
                ", driveType='" + driveType + '\'' +
                ", mainImage='" + mainImage + '\'' +
                ", vehiclePlate='" + vehiclePlate + '\'' +
                ", car_km=" + carKm +
                ", seatingCapacity=" + seatingCapacity +
                ", usedCarImages=" + usedCarImages +
                ", deletedImages=" + deletedImages +
                ", descriptions='" + description + '\'' +
                '}';
    }
}
