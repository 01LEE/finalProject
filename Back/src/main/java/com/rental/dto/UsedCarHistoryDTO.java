package com.rental.dto;

public class UsedCarHistoryDTO {

    private String vehicleNo;           // vehicle_no
    private String accidentHistory;     // accident_history
    private String maintenanceHistory;  // maintenance_history
    private String ownerId;             // owner_id

    // 기본 생성자
    public UsedCarHistoryDTO() {
    }

    // 모든 필드를 포함하는 생성자
    public UsedCarHistoryDTO(String vehicleNo, String accidentHistory, String maintenanceHistory, String ownerId) {
        this.vehicleNo = vehicleNo;
        this.accidentHistory = accidentHistory;
        this.maintenanceHistory = maintenanceHistory;
        this.ownerId = ownerId;
    }

    // Getter and Setter
    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public String getAccidentHistory() {
        return accidentHistory;
    }

    public void setAccidentHistory(String accidentHistory) {
        this.accidentHistory = accidentHistory;
    }

    public String getMaintenanceHistory() {
        return maintenanceHistory;
    }

    public void setMaintenanceHistory(String maintenanceHistory) {
        this.maintenanceHistory = maintenanceHistory;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    @Override
    public String toString() {
        return "UsedCarHistoryDTO{" +
                "vehicleNo='" + vehicleNo + '\'' +
                ", accidentHistory='" + accidentHistory + '\'' +
                ", maintenanceHistory='" + maintenanceHistory + '\'' +
                ", ownerId='" + ownerId + '\'' +
                '}';
    }
}
