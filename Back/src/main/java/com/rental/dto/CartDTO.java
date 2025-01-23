package com.rental.dto;

public class CartDTO {

    private int productId;       // product_id
    private int userNo;          // user_no
    private String productName;  // product_name
    private double productPrice; // product_price
    private String productImage; // product_image
    private int productCount;    // product_count

    // 기본 생성자
    public CartDTO() {
    }

    // 모든 필드를 포함하는 생성자
    public CartDTO(int productId, int userNo, String productName, double productPrice, String productImage, int productCount) {
        this.productId = productId;
        this.userNo = userNo;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productImage = productImage;
        this.productCount = productCount;
    }

    // Getter and Setter
    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getUserNo() {
        return userNo;
    }

    public void setUserNo(int userNo) {
        this.userNo = userNo;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(double productPrice) {
        this.productPrice = productPrice;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public int getProductCount() {
        return productCount;
    }


    public void setProductCount(int productCount) {
        this.productCount = productCount;
    }

    @Override
    public String toString() {
        return "CartDTO{" +
                "productId=" + productId +
                ", userNo=" + userNo +
                ", productName='" + productName + '\'' +
                ", productPrice=" + productPrice +
                ", productImage='" + productImage + '\'' +
                ", productCount=" + productCount +
                '}';
    }
}
