package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyRentalVolumeDto {
    private String yearMonth;
    private int totalContracts;
    private int totalFreeCars;
    private int totalRentedCars;
    private double totalIncome;
}
