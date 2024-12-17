package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RentalContractSummaryDto {
    private String dayLabel;
    private String name;
    private String status;
    private int totalContracts;
    private double totalValue;
    private Double income;

    public RentalContractSummaryDto(String dayLabel, String status, int totalContracts, double totalValue, Double income) {
        this.dayLabel = dayLabel;
        this.status = status;
        this.totalContracts = totalContracts;
        this.totalValue = totalValue;
        this.income = income;
    }

    public RentalContractSummaryDto(String name, Integer totalContracts, Double totalRentalValue) {
        this.name = name;
        this.totalContracts = totalContracts;
        this.totalValue = totalRentalValue;
    }
}