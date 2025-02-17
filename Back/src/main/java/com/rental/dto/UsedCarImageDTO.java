package com.rental.dto;

public class UsedCarImageDTO {
    private int imageId;         // 이미지 ID
    private String vehicleNo;    // 차량 번호
    private String imageUrl;     // 이미지 URL
    private String mainImage;    // 대표 이미지 여부 (Y/N)

    // 기본 생성자
    public UsedCarImageDTO() {}

    // 매개변수 생성자
    public UsedCarImageDTO(int imageId, String vehicleNo, String imageUrl, String mainImage) {
        this.imageId = imageId;
        this.vehicleNo = vehicleNo;
        this.imageUrl = imageUrl;
        this.mainImage = mainImage;
    }

    // Getter and Setter
    public int getImageId() {
        return imageId;
    }

    public void setImageId(int imageId) {
        this.imageId = imageId;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getMainImage() {
        return mainImage;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }

    // toString() 메서드 (디버깅용)
    @Override
    public String toString() {
        return "UsedCarImageDTO [imageId=" + imageId + ", vehicleNo=" + vehicleNo + ", imageUrl=" + imageUrl
                + ", mainImage=" + mainImage + "]";
    }
}

