package com.rental.dto;

import java.util.Date;


public class UserDTO {
    private int userNo;
    private String password;
    private String name;
    private String email;
    private String phone;
    private String role;
    private Date joinDate;
    private Boolean driverLicense;
    private int point;
    private String userId;
    private String profileImage;

    // Getters and Setters
    public int getUserNo() {
        return userNo;
    }

    public void setUserNo(int userNo) {
        this.userNo = userNo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Date getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(Date joinDate) {
        this.joinDate = joinDate;
    }

    public Boolean getDriverLicense() {
        return driverLicense;
    }

    public void setDriverLicense(Boolean driverLicense) {
        this.driverLicense = driverLicense;
    }

    public int getPoint() {
        return point;
    }

    public void setPoint(int point) {
        this.point = point;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "userNo=" + userNo +
                ", userId='" + userId + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", role='" + role + '\'' +
                ", joinDate=" + joinDate +
                ", driverLicense=" + driverLicense +
                ", point=" + point +
                ", profileImage='" + profileImage + '\'' +
                '}';
    }
}
