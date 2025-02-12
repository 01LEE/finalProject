package com.rental.dto;

public class ProductDTO {

    private int productId;                // product_id
    private double productPrice;          // product_price
    private String productName;           // product_name
    private String categoryMain;          // category_main
    private String categorySub;           // category_sub
    private String categoryDetail;        // category_detail
    private String productImage;          // product_image
    

    // 기본 생성자
    public ProductDTO() {
    }

    // 모든 필드를 포함하는 생성자
    public ProductDTO(int productId, double productPrice, String productName, String categoryMain,
                      String categorySub, String categoryDetail, String productImage) {
        this.productId = productId;
        this.productPrice = productPrice;
        this.productName = productName;
        this.categoryMain = categoryMain;
        this.categorySub = categorySub;
        this.categoryDetail = categoryDetail;
        this.productImage = productImage;
        
    }

    // Getter and Setter
    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(double productPrice) {
        this.productPrice = productPrice;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategoryMain() {
        return categoryMain;
    }

    public void setCategoryMain(String categoryMain) {
        this.categoryMain = categoryMain;
    }

    public String getCategorySub() {
        return categorySub;
    }

    public void setCategorySub(String categorySub) {
        this.categorySub = categorySub;
    }

    public String getCategoryDetail() {
        return categoryDetail;
    }

    public void setCategoryDetail(String categoryDetail) {
        this.categoryDetail = categoryDetail;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

/*************  ✨ Codeium Command ⭐  *************/
    /**
     * 
     * @return productDetailImage
     */


    @Override
    public String toString() {
        return "ProductDTO{" +
                "productId=" + productId +
                ", productPrice=" + productPrice +
                ", productName='" + productName + '\'' +
                ", categoryMain='" + categoryMain + '\'' +
                ", categorySub='" + categorySub + '\'' +
                ", categoryDetail='" + categoryDetail + '\'' +
                ", productImage='" + productImage + '\'' +
                '}';
    }
}
