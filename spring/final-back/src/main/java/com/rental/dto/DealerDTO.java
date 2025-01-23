package com.rental.dto;

public class DealerDTO {

    private int dealerNo;        // dealer_no
    private String storeName;    // store_name
    private String longitude;    // longitude
    private String latitude;     // latitude

    // 기본 생성자
    public DealerDTO() {
    }

    // 모든 필드를 포함하는 생성자
    public DealerDTO(int dealerNo, String storeName, String longitude, String latitude) {
        this.dealerNo = dealerNo;
        this.storeName = storeName;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    // Getter and Setter
    public int getDealerNo() {
        return dealerNo;
    }

    public void setDealerNo(int dealerNo) {
        this.dealerNo = dealerNo;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    @Override
    public String toString() {
        return "DealerDTO{" +
                "dealerNo=" + dealerNo +
                ", storeName='" + storeName + '\'' +
                ", longitude='" + longitude + '\'' +
                ", latitude='" + latitude + '\'' +
                '}';
    }
}
