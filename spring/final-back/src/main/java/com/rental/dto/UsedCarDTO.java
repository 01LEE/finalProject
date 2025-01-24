package com.rental.dto;


public class UsedCarDTO {

    private String vehicleName;    // vehicle_name
    private String vehicleNo;       // vehicle_no
    private int dealerNo;           // dealer_no
    private String vehicleType;     // vehicle_type
    private String brand;           // brand
    private int modelYear;          // model_year
    private int price;       // price
    private String color;           // color
    private String dealerLocation;  // dealer_location
    private String fuelType;        // fuel_type
    private String transmission;    // transmission
    private String driveType;       // drive_type
    private String usedCarImage;    // used_car_image
    private String vehiclePlate;    // vehicle_plate
    private int car_km;             // car_km

    // 기본 생성자
    public UsedCarDTO() {
    }

    // 모든 필드를 포함하는 생성자
    public UsedCarDTO(String vehicleName, String vehicleNo, int dealerNo, String vehicleType, String brand, int modelYear,
                      int price, String color, String dealerLocation, String fuelType,
                      String transmission, String driveType, String usedCarImage, String vehiclePlate, int car_km) {
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
        this.usedCarImage = usedCarImage;
        this.vehiclePlate = vehiclePlate;
        this.car_km = car_km;
    }

    // Getter and Setter
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

    public String getUsedCarImage() {
        return usedCarImage;
    }

    public void setUsedCarImage(String usedCarImage) {
        this.usedCarImage = usedCarImage;
    }

    public String getVehiclePlate() {
        return vehiclePlate;
    }

    public void setVehiclePlate(String vehiclePlate) {
        this.vehiclePlate = vehiclePlate;
    }

    public int getCar_km() {
        return car_km;
    }

    public void setCar_km(int car_km) {
        this.car_km = car_km;
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
                ", usedCarImage='" + usedCarImage + '\'' +
                ", vehiclePlate='" + vehiclePlate + '\'' +
                ", car_km=" + car_km +
                '}';
    }
}