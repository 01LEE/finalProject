package com.rental.dto;

public class ProductDetailDTO {
    
    private int productId;
    private int productCount;
    private String productColor;
    private String storeLocation;
    private String productName;
    private String productImage;  // ✅ 추가
    private double productPrice;  // ✅ 추가

    public ProductDetailDTO() {}

    public ProductDetailDTO(int productId, int productCount, String productColor, String storeLocation, String productName, String productImage, double productPrice) {
        this.productId = productId;
        this.productCount = productCount;
        this.productColor = productColor;
        this.storeLocation = storeLocation;
        this.productName = productName;
        this.productImage = productImage;
        this.productPrice = productPrice;
    }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public int getProductCount() { return productCount; }
    public void setProductCount(int productCount) { this.productCount = productCount; }

    public String getProductColor() { return productColor; }
    public void setProductColor(String productColor) { this.productColor = productColor; }

    public String getStoreLocation() { return storeLocation; }
    public void setStoreLocation(String storeLocation) { this.storeLocation = storeLocation; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public double getProductPrice() { return productPrice; }
    public void setProductPrice(double productPrice) { this.productPrice = productPrice; }

    @Override
    public String toString() {
        return "ProductDetailDTO{" +
                "productId=" + productId +
                ", productCount=" + productCount +
                ", productColor='" + productColor + '\'' +
                ", storeLocation='" + storeLocation + '\'' +
                ", productImage='" + productImage + '\'' +
                ", productPrice=" + productPrice +
                '}';
    }
}
